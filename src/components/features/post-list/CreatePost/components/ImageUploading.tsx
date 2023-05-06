import { Image as ImageModel } from "@/models/Image";
import { uploadImage } from "@/mutations/images";
import { MinusIcon } from "@chakra-ui/icons";
import { Center, IconButton, Image, Spinner } from "@chakra-ui/react";
import { useMutation } from "@datx/swr";
import { FC, useEffect, useRef } from "react";

interface IImageUploading {
  url: string;
  onUpload: (urls: { blobUrl: string; image: ImageModel }) => void;
  onFail: (blobUrl: string) => void;
}

export const ImageUploading: FC<IImageUploading> = ({ url, onUpload, onFail }) => {
  const [upload, { status: uploadStatus }] = useMutation(uploadImage as any, {
    onSuccess: ({ data: image }) => {
      onUpload({ blobUrl: url, image: image.data as any });
    },
    onFailure: () => {
      onFail(url);
    },
  });

  const hasTriedUploading = useRef(false);

  useEffect(() => {
    if (!hasTriedUploading.current) {
      hasTriedUploading.current = true;
      upload({ blob: url });
    }
  }, [url, upload]);

  return (
    <Center pos="relative" boxSize="120px" borderRadius="12px" overflow="hidden">
      <Image src={url} boxSize="120px" objectFit="cover" alt="Photo" opacity={uploadStatus === "running" ? 0.5 : 1} />
      {uploadStatus === "running" && <Spinner pos="absolute" />}

      <IconButton
        pos="absolute"
        top="2px"
        right="2px"
        icon={<MinusIcon />}
        aria-label="Remove"
        variant="solid"
        colorScheme="red"
        rounded="full"
        size="xs"
      />
    </Center>
  );
};
