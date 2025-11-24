import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { HeartPulse, UserCheck, Shield, Zap } from "lucide-react-native";

// Color Palette
const COLORS = {
  primary: "#DC2626", // Red
  lightBg: "#F9FAFB", // Light Gray background
  lightCard: "#FFFFFF",
  lightText: "#111827", // Gray 900
  lightSubtext: "#4B5563", // Gray 600
  lightBorder: "#E5E7EB", // Gray 200
};

export default function LifePlusLandingPage() {
  const BACKGROUND_COLOR = COLORS.lightBg;
  const TITLE_COLOR = COLORS.lightText;
  const SUBTITLE_COLOR = COLORS.lightSubtext;
  const BORDER_COLOR = COLORS.lightBorder;

  const handleAuthAction = (action) => {
    alert(`${action} functionality initiated!`);
  };

  const features = [
    {icon: HeartPulse,
      title: "Real-time Needs",
      description: "Get instant alerts for urgent blood requirements...",
    },
    {icon: UserCheck,
      title: "Seamless Registration",
      description: "Register as a donor or patient easily and securely...",
    },
    {icon: Shield,
      title: "Secure & Verified",
      description: "All requests and donations are verified by hospitals...",
    },
    {icon: Zap,
      title: "Quick Matching",
      description: "Our smart system connects donors to recipients fast...",
    },
  ];
  return (
    <View style={[styles.mainContainer, { backgroundColor: BACKGROUND_COLOR }]}>
      <View
        style={[
          styles.header,
          {backgroundColor: BACKGROUND_COLOR, borderBottomColor: BORDER_COLOR,},
        ]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <HeartPulse size={30} color={COLORS.primary} />
            <Text style={[styles.logoText, { color: TITLE_COLOR }]}>
              LifePlus
            </Text>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={() => handleAuthAction("Login")}
              style={[styles.loginButton, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.mainScrollViewContent}>
        <View style={styles.heroSection}>
          <Text style={[styles.heroSubtitle, { color: COLORS.primary }]}>
            Join the Life Saving Network
          </Text>
          <Text style={[styles.heroTitle, { color: TITLE_COLOR }]}>
            Connect Donors to Need,
            <Text style={{ color: COLORS.primary }}> Instantly.</Text>
          </Text>
          <Text style={[styles.heroDescription, { color: SUBTITLE_COLOR }]}>
            LifePlus is the fast, reliable platform linking willing blood
            donors...
          </Text>
          <View style={styles.ctaContainer}>
            <TouchableOpacity
              onPress={() => handleAuthAction("Sign Up")}
              style={[
                styles.primaryCtaButton,
                { backgroundColor: COLORS.primary },
              ]}
            >
              <Text style={styles.primaryCtaText}>Become a Donor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAuthAction("Learn More")}
              style={[
                styles.secondaryCtaButton,
                {
                  borderColor: COLORS.primary,
                  backgroundColor: COLORS.lightCard,
                },
              ]}
            >
              <Text
                style={[styles.secondaryCtaText, { color: COLORS.primary }]}
              >
                Request Blood
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Features Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: TITLE_COLOR }]}>
            How LifePlus Works
          </Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              // All colors use light theme definitions
              const cardBg = COLORS.lightCard;
              const titleColor = COLORS.lightText;
              const descriptionColor = COLORS.lightSubtext;

              return (
                <View
                  key={index}
                  style={[
                    styles.featureCard,
                    {
                      backgroundColor: cardBg,
                      borderColor: BORDER_COLOR, // Using static light border
                    },
                  ]}
                >
                  <Icon
                    size={32}
                    color={COLORS.primary}
                    style={styles.iconMargin}
                  />
                  <Text style={[styles.cardTitle, { color: titleColor }]}>
                    {feature.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardDescription,
                      { color: descriptionColor },
                    ]}
                  >
                    {feature.description}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// --- React Native Stylesheet ---
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  mainScrollViewContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    maxWidth: 768,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    zIndex: 10,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 768,
    alignSelf: "center",
    width: "100%",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "700",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginButtonText: {
    fontWeight: "600",
    color: COLORS.lightCard,
  },
  // Hero Section Styles
  heroSection: {
    alignItems: "center",
    paddingVertical: 30,
    marginBottom: 40,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: "900",
    lineHeight: 52,
    marginBottom: 15,
    textAlign: "center",
  },
  heroDescription: {
    fontSize: 16,
    textAlign: "center",
    maxWidth: 500,
    marginBottom: 30,
  },
  ctaContainer: {
    flexDirection: "column",
    gap: 15,
    width: "100%",
    maxWidth: 350,
  },
  primaryCtaButton: {
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 8,
    alignItems: "center",
  },
  primaryCtaText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.lightCard,
  },
  secondaryCtaButton: {
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  secondaryCtaText: {
    fontSize: 18,
    fontWeight: "700",
  },
  // Features Section Styles
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  // Feature Card Styles
  featureCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    width: "48%",
    marginBottom: 15,
    elevation: 5,
    // Note: Shadow color for light theme is inherited from the default styles
  },
  iconMargin: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
  },
});
