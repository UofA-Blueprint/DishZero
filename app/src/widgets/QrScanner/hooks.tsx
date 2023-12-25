import { MutableRefObject, useEffect, useRef } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

import { UseQrReaderHook } from './types';

import { isMediaDevicesSupported, isValidType } from './utils';

// TODO: add support for debug logs
export const useQrReader: UseQrReaderHook = ({
  // scanDelay: delayBetweenScanAttempts,
  // constraints: video,
  onResult,
  videoId,
  onError,
  deviceIndex
}) => {
  const initialized = useRef(false)
  console.log("useEffectCalled!")


  const controlsRef: MutableRefObject<IScannerControls> = useRef(null);
  // console.log(controlsRef)
  useEffect(() => {
    // if(controlsRef.current){

    // }
    console.log('yes?',controlsRef.current)
    if (!initialized.current || controlsRef.current) {
  console.log('inside',controlsRef)

      controlsRef.current?.stop();
      initialized.current = true
  
    const codeReader = new BrowserQRCodeReader();
    (async function(){
      // BrowserQRCodeReader.
      const devices = await BrowserQRCodeReader.listVideoInputDevices();
      const currentDevice = devices[deviceIndex%(devices.length)].deviceId;
      console.log(devices);
    
      
      // console.log()
      if (
        !isMediaDevicesSupported() &&
        isValidType(onResult, 'onResult', 'function')
      ) {
        const message =
          'MediaDevices API has no support for your browser. You can fix this by running "npm i webrtc-adapter"';

        onResult(undefined, new Error(message), codeReader);
      }

      // if (isValidType(video, 'constraints', 'object')) {
        console.log(currentDevice)
        // codeReader.decodeFromConstraints()
        // codeReader.decodeFromVideoDevice()
        // codeReader
        codeReader
          .decodeFromVideoDevice(currentDevice, videoId, (result, error) => {
            console.log(result);
            if (isValidType(onResult, 'onResult', 'function')) {
              onResult(result, error, codeReader);
            }
          })
          .then((controls: IScannerControls) => {controlsRef.current = controls;console.log(controls)})
          .catch((error: Error) => {
            if (isValidType(onResult, 'onResult', 'function')) {
              onError(error);
              // onResult(null, error, codeReader);
            }
          });
      // }
    })()
    return () => {
      controlsRef.current?.stop();
    }
    }
  }, [deviceIndex]);
};