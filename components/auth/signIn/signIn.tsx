import { Keyboard } from "react-native";
import { Button, Card, Input, Text, XStack, YStack } from "tamagui";

type Props = {
    error: string;
    email: string;
    setEmail: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    handleForgotPassword: () => void;
    handleSignIn: () => void;
    handleCreateAccount: () => void;
    loading: boolean;
    isFormValid: boolean;
}

export default function SignInComponent(
    {
        error,
        email,
        setEmail,
        password,
        setPassword,
        handleForgotPassword,
        handleSignIn,
        handleCreateAccount,
        loading,
        isFormValid
    } : Props
) {
    return (
    <YStack 
      f={1} 
      ai="center" 
      jc="center" 
      backgroundColor="#f5f5f5"
      p="$4"
      onPress={() => Keyboard.dismiss()}
    >
      <Card 
        elevate 
        size="$4" 
        w="100%" 
        maxWidth={400}
        p="$6"
        gap="$4"
      >
        {/* Header */}
        <YStack ai="center" gap="$2" mb="$2">
          <Text fontSize="$9" fontWeight="bold" color="#7c3aed">
            Welcome Back
          </Text>
          <Text fontSize="$4" color="$gray10">
            Sign in to continue
          </Text>
        </YStack>

        {/* Error Message */}
        {error && (
          <YStack
            backgroundColor="#fee2e2"
            p="$3"
            borderRadius="$3"
            borderWidth={1}
            borderColor="#ef4444"
          >
            <Text fontSize="$3" color="#dc2626">
              {error}
            </Text>
          </YStack>
        )}

        {/* Email Input */}
        <YStack gap="$2">
          <Text color="$gray11" fontSize="$3">
            Email
          </Text>
          <Input
            size="$4"
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            borderColor="#e9d5ff"
            focusStyle={{ borderColor: '#7c3aed' }}
          />
        </YStack>

        {/* Password Input */}
        <YStack gap="$2">
          <Text color="$gray11" fontSize="$3">
            Password
          </Text>
          <Input
            size="$4"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            borderColor="#e9d5ff"
            focusStyle={{ borderColor: '#7c3aed' }}
          />
        </YStack>

        {/* Forgot Password */}
        <XStack jc="flex-end">
          <Button
            chromeless
            onPress={handleForgotPassword}
            pressStyle={{ opacity: 0.7 }}
          >
            <Text
              fontSize="$2"
              color="#7c3aed"
              fontWeight="600"
            >
              Forgot Password?
            </Text>
          </Button>
        </XStack>

        {/* Sign In Button */}
        <Button
          theme="purple"
          backgroundColor="#7c3aed"
          color="white"
          onPress={handleSignIn}
          disabled={loading || !isFormValid}
          opacity={loading || !isFormValid ? 0.5 : 1}
          pressStyle={{ backgroundColor: '#6d28d9' }}
          mt="$2"
        >
          <Text
            fontSize="$5"
            color="white"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Text> 
        </Button>

        {/* Divider */}
        <XStack ai="center" gap="$3" my="$2">
          <YStack f={1} h={1} backgroundColor="$gray6" />
          <Text fontSize="$2" color="$gray10">OR</Text>
          <YStack f={1} h={1} backgroundColor="$gray6" />
        </XStack>

        {/* Create Account Link */}
        <XStack ai="center" jc="center" gap="$2">
          <Text fontSize="$3" color="$gray11">
            Don't have an account?
          </Text>
          <Button
            chromeless
            color="#7c3aed"
            fontWeight="bold"
            onPress={handleCreateAccount}
            pressStyle={{ opacity: 0.7 }}
          >
            <Text
              fontSize="$2"
              color="#7c3aed"
              fontWeight="bold"
            >
              Create Account
            </Text>
          </Button>
        </XStack>
      </Card>
    </YStack>
  );
}