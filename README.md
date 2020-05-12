# launch-extension-old-datalayer
Extension to implement old DumbDataLayer (DDL) used by CTS

This implements the code at `src/libraries/analytics/dumb-datalayer.js` as an extension. The only way that window.dumbDataLayer would be initialized is if the AppMeasurementCustom.initializeDumbDataLayer call is made. That is not implemented in launch anymore, so our code will handle the initialization. The dispatchTrackingEvent referenced by the current CTS code will still be called, and it will push.

When a tracking event is pushed on the DDL a Direct Call (`_satellite.track()`) will be made. The DC handler in launch *should* map properties into the correct shape and push an event onto the NCIDataLayer. 

The 2 calls are:
* DDL:PageLoad - Page Load events
* DDL:Other - Click and other tracking