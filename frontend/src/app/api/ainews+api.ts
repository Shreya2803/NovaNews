import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    console.log("url", url);
    if (!url) {
      return Response.json({ error: "Missing URL" }, { status: 400 });
    }

    // 🕷️ Step 1: 抓取网页内容
    const html = await fetch(url).then((res) => res.text());

    // ⚙️ Step 2: 生成 Prompt
    const prompt = `
You are a professional news analysis assistant.
I will provide you with the raw HTML of a news article. Please extract the main text content, read it carefully, and return a JSON object containing:

{
  "summary": "A concise summary of the article in about 10-30 words.",
  "comment": "An objective AI commentary that points out the importance or potential impact of the news, written in a neutral tone in about 60-100 words."
}

Requirements:
- Do not include any extra explanations or text outside of the JSON.
- Keep your response objective and concise.

The raw web page content is as follows:
${html.slice(0, 100000)}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([{ text: prompt }]);

    const text = result.response.text();
    console.log("server-raw-text", text);

    // ⚙️ Step 3: **关键修改：解析 JSON**
    let parsed: any;
    try {
      // 尝试直接解析
      parsed = JSON.parse(text);
    } catch (e) {
      // 如果失败，清理可能的 markdown 代码块标记 (```json...)
      const cleanedText = text.replace(/```json|```/g, "").trim();
      try {
        parsed = JSON.parse(cleanedText);
        console.log("server-parsed-json (cleaned)", parsed);
      } catch (e2) {
        // 如果清理后仍然无法解析，抛出错误
        console.error("❌ Failed to parse JSON even after cleaning:", e2);
        // 可以选择在这里返回一个 500 错误
        return Response.json(
          { error: "Model response was not valid JSON" },
          { status: 500 }
        );
      }
    }

    // 🏆 返回解析后的 JSON 对象
    return Response.json(parsed);
  } catch (error: any) {
    console.error("❌ Error in analyze API:", error);
    return Response.json(
      { error: "Failed to analyze article" },
      { status: 500 }
    );
  }
}
