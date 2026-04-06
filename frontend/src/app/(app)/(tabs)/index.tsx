import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { timeAgo } from "lib/utils";

const CATEGORIES = [
  { name: "General", query: "general", icon: "globe-outline" },
  { name: "Technology", query: "technology", icon: "hardware-chip-outline" },
  { name: "Business", query: "business", icon: "briefcase-outline" },
  { name: "Health", query: "health", icon: "heart-outline" },
  { name: "Sports", query: "sports", icon: "trophy-outline" },
  { name: "Entertainment", query: "entertainment", icon: "film-outline" },
  { name: "Science", query: "science", icon: "flask-outline" },
];

export default function NewsScreen() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [news, setNews] = useState<any[]>();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchNews = async (category: string) => {
    try {
      setLoading(true);
      const url = `https://api.mediastack.com/v1/news?access_key=${process.env.EXPO_PUBLIC_MEDIASTACK_API_KEY}&categories=${category}&languages=en&limit=20&sort=published_desc`;

      const res = await fetch(url);
      const json = await res.json();

      if (json?.data) {
        setNews(json.data);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedCategory.query);
  }, [selectedCategory]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews(selectedCategory.query);
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-6 bg-white">
        <View className="flex-row items-center mb-1">
          <Ionicons name="newspaper-outline" size={28} color="#3B82F6" />
          <Text className="text-2xl font-bold text-gray-900 ml-2">News</Text>
        </View>
        <Text className="text-gray-600 text-base">
          Stay updated with the latest headlines
        </Text>
      </View>

      {/* Category Buttons */}
      <View className="h-12 ">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-5 h-12"
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.name}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.8}
              className={`flex-row items-center px-4 py-2 mr-3 rounded-full h-12 ${
                selectedCategory.name === cat.name
                  ? "bg-blue-500"
                  : "bg-gray-200"
              }`}
            >
              <Ionicons
                // @ts-ignore
                name={cat.icon}
                size={16}
                color={selectedCategory.name === cat.name ? "white" : "#374151"}
                style={{ marginRight: 6 }}
              />
              <Text
                className={`font-semibold  ${
                  selectedCategory.name === cat.name
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View className="flex items-center justify-center  h-48">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="text-gray-500">Loading News...</Text>
        </View>
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3B82F6"]}
              tintColor="#3B82F6"
            />
          }
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View className="items-center justify-center mt-24">
              <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
              <Text className="text-lg text-gray-600 mt-4">
                {"No news found"}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/news-detail",
                  params: { data: JSON.stringify(item) },
                })
              }
              activeOpacity={0.9}
              className="bg-white rounded-3xl mb-5 shadow-sm shadow-gray-200 overflow-hidden"
            >
              {/* 图片部分 */}
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
              )}

              {/* 内容部分 */}
              <View className="p-4">
                {/* 来源 + 时间 */}
                <View className="flex-row items-center mb-2">
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-500 text-sm ml-1">
                    {item.source} • {timeAgo(item.published_at)}
                  </Text>
                </View>

                {/* 标题 */}
                <Text
                  className="text-lg font-bold text-gray-900 mb-2"
                  numberOfLines={2}
                >
                  {item.title}
                </Text>

                {/* 阅读更多 */}
                <View className="flex-row items-center mt-1">
                  <Text className="text-blue-600 font-semibold">Read more</Text>
                  <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
