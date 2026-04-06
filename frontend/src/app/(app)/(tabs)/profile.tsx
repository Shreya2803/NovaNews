import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useUser } from "@clerk/clerk-expo";

const Profile = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  const getUserAvatar = () => {
    if (user?.imageUrl) {
      return user.imageUrl;
    }
    // 如果没有头像，使用默认头像
    return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
  };

  // 获取用户姓名
  const getUserName = () => {
    if (user?.fullName) {
      return user.fullName;
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return "User";
  };

  const getUserEmail = () => {
    return user?.primaryEmailAddress?.emailAddress || "No email available";
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
              Profile
            </Text>
            <Text className="text-gray-600 text-center text-base">
              Manage your account settings
            </Text>
          </View>

          {/* User Profile Card */}
          <View className="bg-white rounded-3xl shadow-lg shadow-gray-200 p-6 mb-6">
            {/* Avatar and Basic Info */}
            <View className="items-center mb-6">
              <View className="relative mb-4">
                <Image
                  source={{ uri: getUserAvatar() }}
                  className="w-24 h-24 rounded-full"
                  resizeMode="cover"
                />
                <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2">
                  <Ionicons name="camera" size={16} color="white" />
                </TouchableOpacity>
              </View>

              <Text className="text-2xl font-bold text-gray-800 mb-1">
                {getUserName()}
              </Text>
              <Text className="text-gray-600 text-base">{getUserEmail()}</Text>
            </View>

            {/* User Stats */}
            <View className="flex-row justify-around mb-6">
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-600">0</Text>
                <Text className="text-gray-600 text-sm">Locations</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600">0</Text>
                <Text className="text-gray-600 text-sm">Favorites</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600">0</Text>
                <Text className="text-gray-600 text-sm">Days</Text>
              </View>
            </View>
          </View>

          {/* Settings Section */}
          <View className="bg-white rounded-2xl shadow-lg shadow-gray-200 mb-6">
            <View className="p-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-800">
                Settings
              </Text>
            </View>

            {/* Settings Items */}
            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-gray-100"
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="person-outline" size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">Edit Profile</Text>
                <Text className="text-gray-500 text-sm">
                  Update your personal information
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-gray-100"
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4">
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#10B981"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">Notifications</Text>
                <Text className="text-gray-500 text-sm">
                  Manage your notification preferences
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-gray-100"
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="shield-outline" size={20} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">
                  Privacy & Security
                </Text>
                <Text className="text-gray-500 text-sm">
                  Manage your privacy settings
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4"
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-4">
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color="#F97316"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">
                  Help & Support
                </Text>
                <Text className="text-gray-500 text-sm">
                  Get help and contact support
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-500 rounded-2xl p-4 shadow-lg shadow-red-200"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                Sign Out
              </Text>
            </View>
          </TouchableOpacity>

          {/* App Version */}
          <View className="mt-8 items-center">
            <Text className="text-gray-400 text-sm">AI News App v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
