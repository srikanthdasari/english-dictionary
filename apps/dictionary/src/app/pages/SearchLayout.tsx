import { StyleSheet, SafeAreaView, View, } from "react-native"
import { MD3Theme } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';

export const SearchLayout = () => {
  const theme = useTheme();
  const style = styles(theme);
  return <SafeAreaView style={style.container}>
    <View style={style.panel}>
      <Searchbar
        placeholder="Search word" value={""}
      />
    </View>
    {/* <Text style={{ color: theme.colors.primary }} >Search</Text> */}

  </SafeAreaView>
}

const styles = (theme: MD3Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    color: theme.colors.primary,
  },
  panel: {
    // height: 600,
    padding: 20,
    backgroundColor: theme.colors.surface,
  },
})
