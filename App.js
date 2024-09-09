import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const API_KEY = 'bY3OxZ98CzyGeMGUopTydwgkRvOESgUo';
const API_URL = 'https://api.apilayer.com/exchangerates_data/latest';

export default function App() {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [exchangeRates, setExchangeRates] = useState({});
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: { 'apikey': API_KEY },
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          console.log("Error response:", errorMessage);
          throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();
        const rates = data.rates;
        console.log("Fetched rates:", rates);
        setExchangeRates(rates);
        setCurrencies(Object.keys(rates));
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch exchange rates.');
      }
    };

    fetchCurrencies();
  }, []);

  const convertToEuro = () => {
    if (!amount || isNaN(amount)) {
      Alert.alert('Invalid Input', 'Please enter a valid number.');
      return;
    }

    const rate = exchangeRates[selectedCurrency];
    if (!rate) {
      Alert.alert('Error', 'Failed to get exchange rate for selected currency.');
      return;
    }

    const result = (parseFloat(amount) / rate).toFixed(2);
    setConvertedAmount(result);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.header}>Currency Converter</Text>

        {convertedAmount !== null && (
          <Text style={styles.result}>Equivalent in EUR: €{convertedAmount}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={text => setAmount(text)}
        />

        <TouchableOpacity style={styles.button} onPress={convertToEuro}>
          <Text style={styles.buttonText}>Convert</Text>
        </TouchableOpacity>

        <Picker
          selectedValue={selectedCurrency}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
        >
          {currencies.map((currency) => (
            <Picker.Item label={currency} value={currency} key={currency} />
          ))}
        </Picker>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  result: {
    marginBottom: 20,
    fontSize: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
