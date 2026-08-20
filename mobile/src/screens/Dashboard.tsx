import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Package, Trash2, AlertTriangle } from 'lucide-react-native';

export function Dashboard({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>ServeStock Mobile</Text>
      <Text style={styles.subtitle}>Restaurant Operations</Text>

      <View style={styles.grid}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Inventory')}
        >
          <Package color="#22c55e" size={32} />
          <Text style={styles.cardTitle}>Quick Stock</Text>
          <Text style={styles.cardDesc}>Update inventory levels</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Waste')}
        >
          <Trash2 color="#ef4444" size={32} />
          <Text style={styles.cardTitle}>Record Waste</Text>
          <Text style={styles.cardDesc}>Log food waste</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <AlertTriangle color="#f59e0b" size={32} />
          <Text style={styles.cardTitle}>Alerts</Text>
          <Text style={styles.cardDesc}>Check expiring items</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 12,
  },
  cardDesc: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  }
});
