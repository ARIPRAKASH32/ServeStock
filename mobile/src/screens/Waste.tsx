import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import api from '../services/api';

export function Waste({ navigation }: any) {
  const [ingredientId, setIngredientId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('SPOILED');

  const handleRecordWaste = async () => {
    try {
      // In a real app, ingredientId would be selected from a dropdown or barcode scan
      await api.post('/waste', {
        ingredientId,
        quantity: Number(quantity),
        reason,
        date: new Date().toISOString()
      });
      Alert.alert('Success', 'Waste recorded successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to record waste');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Ingredient ID</Text>
        <TextInput 
          style={styles.input} 
          value={ingredientId}
          onChangeText={setIngredientId}
          placeholder="Scan or enter ID"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Quantity Wasted</Text>
        <TextInput 
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="0.0"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleRecordWaste}>
        <Text style={styles.submitButtonText}>Record Waste</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  submitButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  }
});
