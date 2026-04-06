import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { timeAgo } from "lib/utils";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchSearchResults = async (keyword: string) => {
    if (!keyword.trim()) return;
    try {
      setLoading(true);
      const url = `https://api.mediastack.com/v1/news?access_key=${
        process.env.EXPO_PUBLIC_MEDIASTACK_API_KEY
      }&keywords=${encodeURIComponent(
        keyword
      )}&languages=en&limit=20&sort=published_desc`;
      const res = await fetch(url);
      const json = await res.json();
      setResults(json?.data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSearchResults(query);
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-6 bg-white border-b border-gray-100">
        <View className="flex-row items-center mb-3">
          <Ionicons name="search-outline" size={26} color="#3B82F6" />
          <Text className="text-2xl font-bold text-gray-900 ml-2">
            Search News
          </Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-200 rounded-full px-3 py-2">
          {/* <Ionicons name="text-outline" size={20} color="#9CA3AF" /> */}
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search topics, keywords..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-base text-gray-800 "
            returnKeyType="search"
            onSubmitEditing={() => fetchSearchResults(query)}
          />
          <TouchableOpacity
            onPress={() => fetchSearchResults(query)}
            className="ml-2 bg-blue-500 rounded-full px-3 py-2"
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-forward-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-3">Searching news...</Text>
        </View>
      ) : (
        <FlatList
          data={results}
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
            !loading && (
              <View className="items-center justify-center mt-32">
                <Ionicons
                  name="information-circle-outline"
                  size={64}
                  color="#9CA3AF"
                />
                <Text className="text-lg text-gray-600 mt-4">
                  Enter a keyword to search news
                </Text>
              </View>
            )
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
                <View className="flex-row items-center mb-2">
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-500 text-sm ml-1">
                    {item.source} • {timeAgo(item.published_at)}
                  </Text>
                </View>

                <Text
                  className="text-lg font-bold text-gray-900 mb-2"
                  numberOfLines={2}
                >
                  {item.title}
                </Text>

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
};

export default Search;
