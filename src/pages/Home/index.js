import React from 'react';
import { SafeAreaView, StyleSheet, FlatList, View, Text } from 'react-native';
import * as Location from 'expo-location';

import Conditions from '../../components/Conditions';
import Forecast from '../../components/Forecast';
import Header from '../../components/Header';
import Menu from '../../components/Menu';

import api, { key } from '../../services/api';

export default function Home() {
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [weather, setWeather] = React.useState([]);
  const [icon, setIcon] = React.useState({ name: 'cloud', color: '#fff' });
  const [background, setBackground] = React.useState(['#1ed6ff', '#97c1ff']);


  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão negada para acessar a localização.');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const response = await api.get(`weather?key=${key}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
      setWeather(response.data);

      if (response.data.results.currently === 'noite') {
        setBackground(['#0c3741', '#0f2f61']);
      }

      switch (response.data.results.condition_slug) {
        case 'clear_day':
          setIcon({ name: 'partly-sunny', color: '#ffb300' })
          break;
        case 'rain':
          setIcon({ name: 'rainy', color: '#FFF' })
          break;
        case 'storm':
          setIcon({ name: 'rainy', color: '#FFF' })
          break;
      }
      setLoading(false);

    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 17, fontStyle: 'italic' }}>Carregando dados...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <Menu />
      <Header background={background} weather={weather} icon={icon} />
      <Conditions weather={weather} />
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        contentContainerStyle={{ paddingBottom: '5%' }}
        style={styles.list}
        data={weather.results.forecast}
        keyExtractor={item => item.date}
        renderItem={({ item }) => <Forecast data={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f0ff',
    paddingTop: '5%'
  },
  list: {
    marginTop: 10
  }
})