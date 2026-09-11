import React from "react";
import { StatusBar } from "expo-status-bar";
import { LanguageProvider } from "./src/context/LanguageContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <LanguageProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </LanguageProvider>
  );
}