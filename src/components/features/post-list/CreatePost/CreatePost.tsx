import { ChangeEventHandler, FC, useRef, useState } from "react";
import { useMutation } from "@datx/swr";
import { Button, ButtonGroup, Center, Flex, FlexProps, HStack, Input, Textarea } from "@chakra-ui/react";
import { createPost } from "@/mutations/posts";
import { mutate } from "swr";
import { getPostsQuery } from "@/queries/posts";
import { lorem } from "@/utils/lorem";
import { useRouter } from "next/router";
import { ImageUploading } from "./components/ImageUploading";
import { Image } from "@/models/Image";

// TODO: Use form

export const PostCreator: FC<FlexProps> = ({ ...rest }) => {
  const { query } = useRouter();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<string[]>([]);
  const [uploaded, setUploaded] = useState<Record<string, Image>>({});
  const isAllUploaded = images.every((url) => uploaded[url]);

  const [create, { status: createStatus }] = useMutation(createPost as any, {
    onSuccess: () => {
      inputRef.current!.value = "";
      setImages([]);
      setUploaded({});
      setUploadAttempt({});
      mutate(getPostsQuery(query?.id as string));
    },
  });

  const randomPost = () => {
    if (inputRef.current) {
      inputRef.current.value = lorem(1);
      post();
    }
  };

  const post = () => {
    if (inputRef.current?.value) {
      create({ body: inputRef.current.value, images: Object.values(uploaded) });
    }
  };

  const handleDrop: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setImages((images) => images.concat(Array.from(e.target?.files || []).map((file) => URL.createObjectURL(file))));
  };

  const handleUpload = ({ blobUrl, image }: { blobUrl: string; image: Image }) => {
    setUploaded((uploaded) => ({ ...uploaded, [blobUrl]: image }));
  };

  const [uploadAttempt, setUploadAttempt] = useState<Record<string, number>>({});
  const handleFail = (blobUrl: string) => {
    setUploadAttempt((a) => ({ ...a, [blobUrl]: (a[blobUrl] || 0) + 1 }));
  };

  return (
    <Flex direction="column" {...rest}>
      <Textarea ref={inputRef} placeholder="New post" isDisabled={createStatus === "running"} />

      {images.length > 0 && (
        <Flex mt="12px" overflowX="auto">
          <HStack spacing="8px">
            {images.map((url) => (
              <ImageUploading
                key={`${url}${uploadAttempt[url] || 0}`}
                url={url}
                onUpload={handleUpload}
                onFail={handleFail}
              />
            ))}
          </HStack>
        </Flex>
      )}

      <ButtonGroup as={Center} mt="16px" ml="auto">
        <Input ref={fileInputRef} type="file" multiple hidden accept="image/jpeg,image/png" onChange={handleDrop} />

        <Button variant="ghost" size="xs" onClick={() => fileInputRef.current?.click()}>
          Upload photo(s)
        </Button>

        <Button onClick={post} isLoading={createStatus === "running"} isDisabled={!isAllUploaded}>
          Post
        </Button>

        {createStatus !== "running" && (
          <Button onClick={randomPost} isDisabled={!isAllUploaded}>
            RndPost
          </Button>
        )}
      </ButtonGroup>
    </Flex>
  );
};
