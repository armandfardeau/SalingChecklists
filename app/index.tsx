import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useStore } from '../store';

export default function App() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  const decrement = useStore((state) => state.decrement);
  const reset = useStore((state) => state.reset);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zustand + MMKV Demo</Text>
      <Text style={styles.subtitle}>State persists across app restarts</Text>
      
      <View style={styles.counterContainer}>
        <Text style={styles.countLabel}>Count:</Text>
        <Text style={styles.countValue}>{count}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={decrement}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={reset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={increment}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.info}>
        Try closing and reopening the app - your count will be restored!
      </Text>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  countLabel: {
    fontSize: 20,
    marginRight: 10,
  },
  countValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2f95dc',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#2f95dc',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
