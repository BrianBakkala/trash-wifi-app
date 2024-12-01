declare module '@particle/device-control-ble-setup-library' {
    export interface INetwork {
        ssid?: string | null;
        rssi: number;
        security?: any; // Replace `any` with the correct type if known
        credentialsType?: any; // Replace `any` with the correct type if known
    }

    export interface BLEDevice {
        // Define other BLEDevice properties if needed
    }

    // Add any other types or exports you need from this library
}
