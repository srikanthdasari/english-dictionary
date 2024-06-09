import React from "react";

import { BottomNavigation } from 'react-native-paper';
import { MainLayout } from "./pages/MainLayout";
import { SearchLayout } from "./pages/SearchLayout";
import { PreferencesLayout } from "./pages/Preferences";



const RootLayout = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'main', title: 'Main', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'search', title: 'Search', focusedIcon: 'magnify' },
    { key: 'preferences', title: 'Preferences', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
    // { key: 'notifications', title: 'Notifications', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    main: MainLayout,
    search: SearchLayout,
    preferences: PreferencesLayout,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default RootLayout;
