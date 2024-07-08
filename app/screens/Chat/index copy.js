import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Chat = () => {
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  const customers = [
    { id: '1', name: 'Customer 1' },
    { id: '2', name: 'Customer 2' },
    // Add more customers as needed
  ];

  const handleSend = () => {
    if (message.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { id: Date.now().toString(), text: message, customer: selectedCustomer, sender: 'me' },
      ]);
      setMessage('');
    }
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Filter messages based on selectedCustomer
  const filteredMessages = messages.filter(msg => selectedCustomer === 'all' || msg.customer === selectedCustomer);

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select Customer:</Text>
        <Picker
          selectedValue={selectedCustomer}
          onValueChange={(itemValue) => setSelectedCustomer(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="All" value="all" />
          {customers.map(customer => (
            <Picker.Item key={customer.id} label={customer.name} value={customer.id} />
          ))}
        </Picker>
      </View>

      <FlatList
        ref={flatListRef}
        data={filteredMessages.reverse()} // Reverse to show latest messages at the bottom
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.sender === 'me' ? styles.sentMessage : styles.receivedMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        inverted // Show latest messages at the bottom
        onContentSizeChange={() => {
          if (messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          multiline={true}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 75,
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  messagesList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: '#E1E1E1',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default Chat;
