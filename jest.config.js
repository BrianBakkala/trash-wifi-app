module.exports = {
    preset: 'react-native',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  // Make sure babel-jest is used
    },
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|@particle/react-native-ble-setup-library)/)',  // Allow transformation for specific node_modules
    ],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};

