import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

interface FilterModalProps {
  visible: boolean;
  title: string;
  options: string[];
  onSelect: (option: string | null) => void;
  onClose: () => void;
}

export default function FilterModal({
  visible,
  title,
  options,
  onSelect,
  onClose,
}: FilterModalProps) {
  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => {
        onSelect(item === 'All' ? null : item.toLowerCase().replace(' ', '_'));
        onClose();
      }}
    >
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          <FlatList
            data={['All', ...options]}
            renderItem={renderItem}
            keyExtractor={(item) => item}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    maxHeight: '60%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
