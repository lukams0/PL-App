import { Spinner, Text, YStack } from "tamagui";

export default function LoadingScreen(){
   return (
         <YStack f={1} ai="center" jc="center" backgroundColor="#f5f5f5">
           <Spinner size="large" color="#7c3aed" />
            <Text fontSize="$4" color="$gray10" mt="$4">
                Loading...
            </Text>
            <Text fontSize="$2" color="$gray9" mt="$2">
                Checking authentication
            </Text>
         </YStack>
       ); 
    }