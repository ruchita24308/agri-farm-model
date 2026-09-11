import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSelectScreen } from "../screens/LanguageSelectScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { RecommendationScreen } from "../screens/RecommendationScreen";
import { GroundwaterScreen } from "../screens/GroundwaterScreen";
import { ShareSummaryScreen } from "../screens/ShareSummaryScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { isFirstLaunch, loading } = useLanguage();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.primary }, headerTintColor: "#fff" }}>
        {isFirstLaunch ? (
          <Stack.Screen name="Language" component={LanguageSelectScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Recommendations" component={RecommendationScreen} />
            <Stack.Screen name="Groundwater" component={GroundwaterScreen} />
            <Stack.Screen name="Share" component={ShareSummaryScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};