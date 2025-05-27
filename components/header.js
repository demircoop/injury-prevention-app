import { Text, View } from 'react-native';

export default function Header({ title }) {
  return (
    <View style={{ padding: 20, backgroundColor: '#eee' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
    </View>
  );
}
