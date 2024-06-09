import { View, StyleSheet, SafeAreaView, } from "react-native"
export const PreferencesLayout = () => {
  return <SafeAreaView style={[
    styles.container,
    {
      // Try setting `flexDirection` to `"row"`.
      flexDirection: 'column',
    },
  ]}
  >
    <View style={{ flex: 1, backgroundColor: '#c1d6f7' }} />
    <View style={{ flex: 2, backgroundColor: '#7caaf2' }} />
    <View style={{ flex: 3, backgroundColor: '#4186f2' }} />

  </SafeAreaView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})
