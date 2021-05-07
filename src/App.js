import React, { useState } from "react";

import "./styles.css";

import ImageUploading from "react-images-uploading";

import Cropper from "react-easy-crop";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@material-ui/core";

import { cropImage } from "./cropUtils";

const ImageUploadingButton = ({ value, onChange, ...props }) => {
  return (
    <ImageUploading value={value} onChange={onChange}>
      {({ onImageUpload, onImageUpdate }) => (
        <Button
          color="primary"
          onClick={value ? onImageUpload : () => onImageUpdate(0)}
          {...props}
        >
          Upload
        </Button>
      )}
    </ImageUploading>
  );
};

const ImageCropper = ({
  open,
  image,
  onComplete,
  containerStyle,
  ...props
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Crop Image</DialogTitle>

      <DialogContent>
        <div style={containerStyle}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={(_, croppedAreaPixels) => {
              setCroppedAreaPixels(croppedAreaPixels);
            }}
            onZoomChange={setZoom}
            {...props}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          color="primary"
          onClick={() =>
            onComplete(cropImage(image, croppedAreaPixels, console.log))
          }
        >
          Finish
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function App() {
  const [image, setImage] = useState([]);
  const [croppedImage, setCroppedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="App">
      <ImageUploadingButton
        value={image}
        onChange={(newImage) => {
          setDialogOpen(true);
          setImage(newImage);
        }}
      />
      <ImageCropper
        open={dialogOpen}
        image={image.length > 0 && image[0].dataURL}
        onComplete={(imagePromisse) => {
          imagePromisse.then((image) => {
            setCroppedImage(image);
            setDialogOpen(false);
          });
        }}
        containerStyle={{
          position: "relative",
          width: "100%",
          height: 300,
          background: "#333"
        }}
      />
      {croppedImage && <img src={croppedImage} alt="blab" />}
    </div>
  );
}
