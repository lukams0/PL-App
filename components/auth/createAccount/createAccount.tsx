import { Keyboard } from "react-native";
import { Button, Card, Input, Switch, Text, XStack, YStack } from "tamagui";

type AccountRole = 'athlete' | 'coach';

type CreateAccountProps = {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  error: string;
  loading: boolean;
  isFormValid: boolean;
  handleSignUp: () => void;
  handleSignIn: () => void;
  accountRole: AccountRole;
  setAccountRole: (role: AccountRole) => void;
};

export default function CreateAccountComponent({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  error,
  loading,
  isFormValid,
  handleSignIn,
  handleSignUp,
  accountRole,
  setAccountRole,
}: CreateAccountProps) {
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
        {/* Account Type Toggle */}
        <XStack ai="center" jc="space-between" mb="$2">
          <Text fontSize="$3" color="$gray11">
            Account Type
          </Text>
          <XStack ai="center" gap="$2">
            <Text
              fontSize="$3"
              color={accountRole === 'athlete' ? "#7c3aed" : "$gray11"}
            >
              Athlete
            </Text>
            <Switch
              size="$3"
              checked={accountRole === 'coach'}
              onCheckedChange={(val) => setAccountRole(val ? 'coach' : 'athlete')}
            >
              <Switch.Thumb animation="quick" />
            </Switch>
            <Text
              fontSize="$3"
              color={accountRole === 'coach' ? "#7c3aed" : "$gray11"}
            >
              Coach
            </Text>
          </XStack>
        </XStack>

        {/* Header */}
        <YStack ai="center" gap="$2" mb="$2">
          <Text fontSize="$9" fontWeight="bold" color="#7c3aed">
            Create Account
          </Text>
          <Text fontSize="$4" color="$gray10">
            Sign up to get started
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

        {/* Name Input */}
        <YStack gap="$2">
          <Text color="$gray11" fontSize="$3">
            Full Name
          </Text>
          <Input
            size="$4"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
            borderColor="#e9d5ff"
            focusStyle={{ borderColor: '#7c3aed' }}
          />
        </YStack>

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

        {/* Confirm Password Input */}
        <YStack gap="$2">
          <Text color="$gray11" fontSize="$3">
            Confirm Password
          </Text>
          <Input
            size="$4"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            borderColor="#e9d5ff"
            focusStyle={{ borderColor: '#7c3aed' }}
          />
          {confirmPassword && password !== confirmPassword && (
            <Text fontSize="$2" color="#ef4444">
              Passwords do not match
            </Text>
          )}
        </YStack>

        {/* Sign Up Button */}
        <Button
          size="$5"
          theme="purple"
          backgroundColor="#7c3aed"
          color="white"
          onPress={handleSignUp}
          disabled={loading || !isFormValid}
          opacity={loading || !isFormValid ? 0.5 : 1}
          pressStyle={{ backgroundColor: '#6d28d9' }}
          mt="$2"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>

        {/* Divider */}
        <XStack ai="center" gap="$3" my="$2">
          <YStack f={1} h={1} backgroundColor="$gray6" />
          <Text fontSize="$2" color="$gray10">OR</Text>
          <YStack f={1} h={1} backgroundColor="$gray6" />
        </XStack>

        {/* Sign In Link */}
        <XStack ai="center" jc="center" gap="$2">
          <Text fontSize="$3" color="$gray11">
            Already have an account?
          </Text>
          <Button
            size="$2"
            chromeless
            color="#7c3aed"
            fontWeight="bold"
            onPress={handleSignIn}
            pressStyle={{ opacity: 0.7 }}
          >
            Sign In
          </Button>
        </XStack>
      </Card>
    </YStack>
  );
}
