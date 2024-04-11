import React from 'react';
import PropTypes from 'prop-types';
import {ImageBackground, TouchableOpacity, View} from 'react-native';
import {Images, BaseColor} from '../../config';
import Icon from '../Icon';
import Text from '../Text';
import styles from './styles';

const SearchCard = ({
  style = {},
  image = Images.eProduct,
  title = '',
  dateTime = '',
  hours = '',
  playTime = '',
  price = '',
  onPress,
}) => {
  return (
    <View
      style={[styles.contain, style, {borderBottomColor: BaseColor.blueColor}]}
      activeOpacity={0.9}>
      <TouchableOpacity onPress={onPress}>
        <ImageBackground
          source={image}
          style={styles.imageBackgroundCard3}
          imageStyle={{borderRadius: 8}}
        />
      </TouchableOpacity>
      <View style={{flex: 1, paddingLeft: 10, flexDirection: 'column'}}>
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <TouchableOpacity onPress={onPress}>
              <Text bold subhead numberOfLines={1}>
                {title}
              </Text>
            </TouchableOpacity>
            <Text style={styles.dateTime} caption1 light>
              {dateTime}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

SearchCard.propTypes = {
  image: PropTypes.node.isRequired,
  dateTime: PropTypes.string,
  playTime: PropTypes.string,
  quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  price: PropTypes.string,
  title: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
};

SearchCard.defaultProps = {
  image: Images.eProduct,
  dateTime: '',
  playTime: '',
  quantity: '',
  price: '',
  title: '',
  style: {},
  onPress: () => {},
};

export default SearchCard;
