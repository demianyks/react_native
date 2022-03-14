import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { IconButton } from "react-native-paper";
import { Image, Icon } from "react-native-elements";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const URL = "https://jsonplaceholder.typicode.com/photos?albumId=1";
const Tab = createBottomTabNavigator();

function Photos() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const Item = ({ title, url }) => (
    <View style={styles.card}>
      <Image containerStyle={styles.image} source={{ uri: url }} />
      <Text style={styles.text}>{title}</Text>
      <IconButton
        icon="heart"
        style={styles.icon}
        color="grey"
        onPress={() => console.log("liked")}
      />
    </View>
  );

  useEffect(() => {
    fetch(URL)
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setFilteredData(json);
      })
      .catch((error) => {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }) => (
    <Item
      title={item.title.substr(0, 15)}
      url={item.thumbnailUrl}
      id={item.id}
      status={item.status ? item.status : "false"}
    />
  );

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = data.filter(function (item) {
        const itemData = item.title
          ? item.title.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      setFilteredData(data);
      setSearch(text);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        placeholder={"What do you search?"}
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <FlatList
            style={styles.list}
            numColumns={2}
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            PlaceholderContent={<ActivityIndicator />}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

function Favorites() {
  return <View></View>;
}
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Photos"
          component={Photos}
          options={{
            tabBarIcon: ({}) => <Icon name="home" color={"#2b2c2e"} />,
            tabBarLabelStyle: { color: "#2b2c2e" },
            tabBarActiveBackgroundColor: "#e1e3e6",
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={Favorites}
          options={{
            tabBarIcon: ({}) => <Icon name="star" color={"#2b2c2e"} />,
            tabBarLabelStyle: { color: "#2b2c2e" },
            tabBarActiveBackgroundColor: "#e1e3e6",
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 100,
  },
  input: {
    padding: 12,
    width: "80%",
  },
  list: {
    width: "100%",
    alignContent: "center",
    marginLeft: 3,
  },
  card: {
    alignItems: "center",
  },
  image: {
    aspectRatio: 1,
    width: "70%",
    flex: 1,
  },
  text: {
    marginBottom: -30,
  },
  icon: {
    left: "40%",
    top: "-15%",
  },
});
