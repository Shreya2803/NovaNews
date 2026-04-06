import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { timeAgo } from "lib/utils";

interface AiSummary {
  summary: string;
  comment: string;
}

export default function NewsDetail() {
  const router = useRouter();
  const { data } = useLocalSearchParams<{ data: string }>();
  const article = data ? JSON.parse(data) : null;

  const [aiLoading, setAiLoading] = useState(false);
  // const [aiSummary, setAiSummary] = useState<AiSummary | null>({
  //   comment:
  //     "This acquisition signals OpenAI's strategic move to expand beyond general AI models into specialized consumer applications, particularly in high-value, regulated sectors like finance. The integration of Mager's expertise could significantly enhance OpenAI's ability to develop tailored AI products, diversify revenue streams, and solidify its competitive position in the rapidly evolving AI landscape. The success of this strategy will be pivotal in shaping the future of personalized AI experiences.",
  //   summary:
  //     "OpenAI has acqui-hired Roi CEO Michael Mager to focus on personalized consumer AI, potentially in financial services, aiming to boost revenue and develop specialized applications.",
  // });
  const [aiSummary, setAiSummary] = useState<AiSummary | null>(null);
  const getAiSummary = async () => {
    if (!article?.url) return;
    if (aiSummary) return;

    setAiLoading(true);
    try {
      const response = await fetch("/api/ainews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: article.url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown Error");
      }

      const data: AiSummary = await response.json();
      setAiSummary(data);
    } catch (error: any) {
      console.error("Error fetching AI Summary:", error);
      setAiSummary({
        summary: "Error: Failed to fetch AI summary.",
        comment: `Details: ${error.message}`,
      });
    } finally {
      setAiLoading(false);
    }
  };

  if (!article) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
        <Text className="text-gray-600 mt-2">No article data found.</Text>
      </SafeAreaView>
    );
  }

  const isAiError = aiSummary && aiSummary.summary.startsWith("Error:");

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* 顶部标题栏 */}
      <StatusBar barStyle="light-content" backgroundColor="#0000ff" />
      <View className="flex-row items-center px-5 py-3 bg-white shadow-md shadow-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={22} color="#2563EB" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-800 ml-4 flex-1">
          News
        </Text>
      </View>

      {/* 内容区 */}
      <ScrollView showsVerticalScrollIndicator={false} className="p-5 pt-0">
        {/* 图片 */}
        {article.image && (
          <View className="mt-5 rounded-3xl overflow-hidden shadow-md shadow-gray-200">
            <Image
              source={{ uri: article.image }}
              className="w-full h-64"
              resizeMode="cover"
            />
          </View>
        )}

        {/* 内容卡片 */}
        <View className="bg-white rounded-3xl shadow-lg shadow-gray-200 p-5 mt-5">
          {/* 标题 */}
          <Text className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
            {article.title}
          </Text>

          {/* 来源 & 时间 */}
          <View className="flex-row items-center flex-wrap mb-5">
            <View className="flex-row items-center bg-blue-50 px-3 py-1 rounded-full mr-2 my-1">
              <Ionicons name="newspaper-outline" size={14} color="#2563EB" />
              <Text className="text-blue-700 text-xs ml-1 font-medium">
                {article?.source || "Unknown Source"}
              </Text>
            </View>

            <View className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full my-1">
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text className="text-gray-500 text-sm ml-1">
                {timeAgo(article?.published_at)}
              </Text>
            </View>
          </View>

          {/* 正文 */}
          {article.description ? (
            <Text className="text-gray-700 text-base leading-6 mb-6">
              {article.description.replace(/<[^>]+>/g, "")}
            </Text>
          ) : (
            <Text className="text-gray-500 italic">
              No description available.
            </Text>
          )}
        </View>

        {/* AI Summary */}
        {(aiLoading || aiSummary || isAiError) && (
          <View className="bg-white rounded-3xl shadow-lg shadow-gray-200 p-5 mt-5 border border-blue-200">
            <View className="flex-row items-center mb-4">
              <Ionicons name="sparkles" size={24} color="#F59E0B" />
              <Text className="text-xl font-bold text-gray-900 ml-2">
                AI Summary
              </Text>
              {aiLoading && (
                <ActivityIndicator
                  size="small"
                  color="#2563EB"
                  className="ml-3"
                />
              )}
            </View>

            {isAiError ? (
              <View className="bg-red-50 p-4 rounded-xl border border-red-200">
                <Text className="text-red-700 font-semibold mb-2">
                  Error / Unanalyzable
                </Text>
                <Text className="text-red-600 text-sm">
                  {aiSummary?.summary}
                </Text>
              </View>
            ) : (
              aiSummary && (
                <>
                  <Text className="text-base font-semibold text-blue-800 mt-2 mb-1">
                    Summary:
                  </Text>
                  <Text className="text-gray-700 leading-6 mb-4">
                    {aiSummary.summary}
                  </Text>

                  <Text className="text-base font-semibold text-blue-800 mb-1">
                    Objective AI commentary:
                  </Text>
                  <Text className="text-gray-700 leading-6">
                    {aiSummary.comment}
                  </Text>
                </>
              )
            )}
          </View>
        )}

        {/* 底部按钮 */}
        <View className="flex-row justify-between space-x-3 my-6">
          {/* Read Full */}
          {article.url && (
            <TouchableOpacity
              className="flex-1 bg-blue-500 py-3 rounded-2xl flex-row justify-center items-center shadow-md shadow-blue-200 mx-2"
              onPress={() => Linking.openURL(article.url)}
            >
              <Ionicons name="open-outline" size={20} color="white" />
              <Text className="text-white text-base font-semibold ml-2">
                Read Full
              </Text>
            </TouchableOpacity>
          )}

          {/* Get AI Summary */}
          {!aiLoading && !aiSummary && (
            <TouchableOpacity
              className="flex-1 rounded-2xl py-3 items-center mx-2 bg-green-500 shadow-md shadow-green-200"
              onPress={getAiSummary}
              disabled={aiLoading}
            >
              <View className="flex-row items-center">
                <Ionicons name="sparkles" size={20} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  Get AI Summary
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* 加载状态 */}
          {aiLoading && (
            <View className="flex-1 rounded-2xl py-3 items-center bg-gray-400 flex-row justify-center mx-2">
              <ActivityIndicator size="small" color="white" />
              <Text className="text-white font-bold text-base ml-2">
                Analyzing...
              </Text>
            </View>
          )}
        </View>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
