import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { View, StyleSheet } from 'react-native';
export const getIcon = (name: any, size: number = 20, iconStyle: "regular" | "solid" | "brand" = "solid", color = "white",) => (
    <FontAwesome6
        size={size}
        name={name}
        iconStyle={iconStyle}
        style={{ lineHeight: (size + 4), fontSize: (size + 4) }}
        color={color}

    />
);
