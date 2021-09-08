//import liraries npx react-native run-android
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

// const windowWidth = Dimensions.get('window').width;
// console.log(windowWidth);

// create a component
const App = () => {
  // const [city1, setCity1] = useState();
  const [name, setName] = useState();
  const [weather, setWeather] = useState();
  const [humidity, setHumidity] = useState();
  const [visibility, setVisibility] = useState();
  const [temperature, setTemperature] = useState();
  const [mintemperature, setMintemperature] = useState();
  const [maxtemperature, setMaxtemperature] = useState();
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [place, setPlace] = useState('');
  const [click, setClick] = useState(true);
  const [showBtn, setShowBtn] = useState(false);

  const [show, setshow] = useState(false);
  const [isLoading, setLoading] = useState();
  // console.log('1', data);

  useEffect(() => {
    const FetchUser = async () => {
      try {
        const list = [];
        await firestore()
          .collection('cities')
          .get()
          .then(querySnapshot => {
            // console.log('total user', querySnapshot.size);
            querySnapshot.forEach(doc => {
              const {city} = doc.data();
              list.push({
                city,
              });
            });
          });
        setMasterData(list);
        setFilteredData(list);
        // console.log(masterData);
      } catch (err) {
        console.log(err);
      }
    };
    FetchUser();
    return () => FetchUser();
  }, []);

  const getWeather = async placeArg => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${placeArg}&appid=83135973192e8f18f130b562e55333c0`,
      );
      // console.log('2', response);
      const json = await response.json();
      // setLoading(true);
      setName(json.name);
      setWeather(json.weather[0].main);
      setTemperature(Math.floor(json.main.temp - 273.15));
      setHumidity(json.main.humidity);
      setVisibility(json.visibility / 1000);
      setMintemperature(Math.floor(json.main.temp_min - 273.15));
      setMaxtemperature(Math.floor(json.main.temp_max - 273.15));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setshow(true);
    }
  };

  const searchFilter = text => {
    if (text) {
      const newData = masterData.filter(item => {
        const itemData = item.city ? item.city.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      setPlace(text);
      setClick(true);
      setshow(false);
    } else {
      setFilteredData(masterData);
      setPlace(text);
      setShowBtn(false);
      // setshow(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.flatlistTxt1}>Just a Weather App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city"
        placeholderTextColor="#aaaaaa"
        value={place}
        // onChangeText={content => setCity1(content)}
        onChangeText={text => {
          searchFilter(text);
        }}
        // onFocus={console.log('focused')}
      />
      {showBtn ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            getWeather(place);
            setLoading(true);
            setClick(false);

            // console.log('2', data);
          }}>
          <Text style={styles.btnTxt}> Get Weather</Text>
        </TouchableOpacity>
      ) : // <TouchableOpacity style={styles.button}>
      //   <Text style={styles.btnTxt}> Get Weather</Text>
      // </TouchableOpacity>
      null}
      {place && click ? (
        <FlatList
          data={filteredData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setPlace(item.city);
                  setClick(false);
                  setShowBtn(true);
                }}>
                <View style={styles.flatlistCtnr}>
                  <Text style={styles.flatlistTxt}>{item.city}</Text>
                  {/* <Text style={styles.flatlistAge}>Age: {item.age}</Text> */}
                </View>
              </TouchableOpacity>
            );
          }}
          // keyExtractor={}
        />
      ) : null}
      {isLoading ? (
        <>
          <ActivityIndicator size="large" color="#00ff00" />
        </>
      ) : null}
      {show ? (
        <View style={styles.listContainer}>
          <Text
            style={{
              ...styles.list1,
              ...{fontSize: name.length >= 13 ? 50 : 60},
            }}>
            {name}
          </Text>
          <Text style={styles.list}>• Weather: {weather} </Text>
          <Text style={styles.list}>• Temperature: {temperature}°C </Text>
          <Text style={styles.list}>• Min Temp: {mintemperature}°C </Text>
          <Text style={styles.list}>• Max Temp: {maxtemperature}°C </Text>
          <Text style={styles.list}>• Humidity: {humidity} </Text>
          <Text style={styles.list}>• Visibility: {visibility} KM </Text>
        </View>
      ) : null}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    width: 360,
    marginTop: 20,
    borderRadius: 10,
    paddingHorizontal: 16,
    borderColor: 'black',
    borderWidth: 1,
    fontSize: 26,
    color: 'black',
  },
  button: {
    height: 50,
    width: 360,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 12,
    marginTop: 20,
    // top: 100,
  },
  btnTxt: {
    color: 'black',
    fontSize: 28,
  },
  listContainer: {
    flex: 1,
    marginLeft: 40,
    top: 30,
    width: '100%',
  },
  list: {
    fontSize: 26,
    lineHeight: 36,
    marginVertical: 12,
    color: 'white',
  },
  list1: {
    fontSize: 60,
    lineHeight: 36,
    // marginVertical: 16,
    paddingTop: 26,
    // top: 10,
    color: '#00ff00',
  },
  flatlistCtnr: {
    // backgroundColor: 'yellow',
    flex: 1,
    width: 360,
    paddingVertical: 10,
    alignItems: 'center',
  },
  flatlistTxt: {
    fontSize: 26,
    color: 'white',
    // fontWeight: 'bold',
  },
  flatlistTxt1: {
    fontSize: 30,
    color: '#00ff00',
    marginTop: 30,
    // fontWeight: 'bold',
  },
});

export default App;
