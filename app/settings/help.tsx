import HelpComponent from "@/components/athlete/settings/HelpComponent";
import { router } from "expo-router";
import { Linking } from "react-native";

export default function HelpSupportSettings(){
    const handleBack = () => {
        router.back();
    };

    const handleContactSupport = () => {
        Linking.openURL('mailto:support@yourapp.com?subject=Support Request');
    };

    const handleOpenFAQ = () => {
        Linking.openURL('https://yourapp.com/faq');
    };

    const handleOpenTerms = () => {
        Linking.openURL('https://yourapp.com/terms');
    };

    const handleOpenPrivacy = () => {
        Linking.openURL('https://yourapp.com/privacy');
    };

    return (
        <HelpComponent 
            handleBack={handleBack}
            handleContactSupport={handleContactSupport}
            handleOpenFAQ={handleOpenFAQ}
            handleOpenPrivacy={handleOpenPrivacy}
            handleOpenTerms={handleOpenTerms}
        />
    )
}