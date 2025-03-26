import type { FormationInterest } from "~/routes/admin/notifications/notification-page";

// Generate a random date within the last 7 days
function getRandomRecentDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7); // 0-7 days ago
  const hoursAgo = Math.floor(Math.random() * 24); // 0-24 hours ago
  const minutesAgo = Math.floor(Math.random() * 60); // 0-60 minutes ago

  now.setDate(now.getDate() - daysAgo);
  now.setHours(now.getHours() - hoursAgo);
  now.setMinutes(now.getMinutes() - minutesAgo);

  return now.toISOString();
}

// Mock data for notifications
export const mockNotifications: FormationInterest[] = [
  {
    id: "1",
    createdAt: getRandomRecentDate(),
    interest: {
      email: "sophie.martin@example.com",
      fullName: "Sophie Martin",
      phone: "+33 6 12 34 56 78",
      message:
        "Bonjour,\n\nJe suis très intéressée par cette formation car elle correspond parfaitement à mon projet professionnel. J'aimerais savoir si des sessions sont prévues en distanciel et si des financements sont possibles via mon CPF.\n\nMerci d'avance pour votre retour.",
      formation: {
        name: "Développement Web Fullstack",
        description:
          "Formation complète aux technologies modernes du développement web: HTML, CSS, JavaScript, React, Node.js et bases de données.",
        duration: 350,
        level: "Débutant",
        price: 3500,
        status: "pending",
      },
    },
  },
  {
    id: "2",
    createdAt: getRandomRecentDate(),
    interest: {
      email: "thomas.dubois@example.com",
      fullName: "Thomas Dubois",
      phone: "+33 7 98 76 54 32",
      message:
        "Je souhaite me reconvertir dans le domaine du design UX/UI. Cette formation semble correspondre à mes attentes. Pouvez-vous me donner plus d'informations sur les prérequis et le contenu détaillé ?",
      formation: {
        name: "UX/UI Design Professionnel",
        description:
          "Maîtrisez les fondamentaux du design d'interface et de l'expérience utilisateur avec les outils professionnels comme Figma et Adobe XD.",
        duration: 280,
        level: "Intermédiaire",
        price: 2800,
        status: "accepted",
      },
    },
  },
  {
    id: "3",
    createdAt: getRandomRecentDate(),
    interest: {
      email: "julie.moreau@example.com",
      fullName: "Julie Moreau",
      phone: "+33 6 45 67 89 01",
      message:
        "Bonjour, je suis actuellement en poste dans une entreprise de marketing digital et je souhaite approfondir mes compétences en data science. Cette formation est-elle compatible avec un emploi à temps plein ?",
      formation: {
        name: "Data Science & Intelligence Artificielle",
        description:
          "Apprenez à analyser des données complexes et à créer des modèles prédictifs avec Python, Pandas, Scikit-learn et TensorFlow.",
        duration: 420,
        level: "Avancé",
        price: 4200,
        status: "pending",
      },
    },
  },
  {
    id: "4",
    createdAt: getRandomRecentDate(),
    interest: {
      email: "alexandre.petit@example.com",
      fullName: "Alexandre Petit",
      phone: "+33 7 23 45 67 89",
      message:
        "Je suis intéressé par cette formation pour développer mes compétences en cybersécurité. J'ai déjà des bases en réseau et systèmes. Est-ce que cette formation est adaptée à mon profil ?",
      formation: {
        name: "Cybersécurité & Ethical Hacking",
        description:
          "Découvrez les techniques de sécurité informatique, d'audit et de test d'intrusion pour protéger les systèmes et réseaux contre les cyberattaques.",
        duration: 300,
        level: "Intermédiaire",
        price: 3800,
        status: "rejected",
      },
    },
  },
  {
    id: "5",
    createdAt: getRandomRecentDate(),
    interest: {
      email: "chloe.bernard@example.com",
      fullName: "Chloé Bernard",
      phone: "+33 6 78 90 12 34",
      message:
        "Bonjour, je suis freelance et je souhaite me former au marketing digital pour mieux promouvoir mon activité. Cette formation correspond-elle à mes besoins ?",
      formation: {
        name: "Marketing Digital & Growth Hacking",
        description:
          "Maîtrisez les stratégies de marketing digital, SEO, réseaux sociaux et acquisition de clients pour développer votre activité en ligne.",
        duration: 210,
        level: "Débutant",
        price: 2200,
        status: "pending",
      },
    },
  },
  {
    id: "6",
    createdAt: getRandomRecentDate(),
    interest: {
      email: "nicolas.robert@example.com",
      fullName: "Nicolas Robert",
      phone: "+33 7 34 56 78 90",
      message:
        "Je travaille actuellement comme chef de projet et je souhaite me former à la méthodologie Agile et Scrum. Pouvez-vous me préciser les dates des prochaines sessions ?",
      formation: {
        name: "Gestion de Projet Agile & Scrum Master",
        description:
          "Apprenez à gérer des projets avec les méthodologies Agile et Scrum, et préparez-vous à la certification Scrum Master.",
        duration: 140,
        level: "Intermédiaire",
        price: 1800,
        status: "accepted",
      },
    },
  },
  {
    id: "7",
    createdAt: getRandomRecentDate(),
    interest: {
      email: "emma.leroy@example.com",
      fullName: "Emma Leroy",
      phone: "+33 6 89 01 23 45",
      message:
        "Bonjour, je suis étudiante en dernière année d'école de commerce et je souhaite me spécialiser dans le e-commerce. Cette formation est-elle éligible aux stages de fin d'études ?",
      formation: {
        name: "E-commerce & Stratégie Digitale",
        description:
          "Développez et gérez une boutique en ligne performante, optimisez les conversions et maîtrisez les plateformes comme Shopify et WooCommerce.",
        duration: 250,
        level: "Débutant",
        price: 2500,
        status: "pending",
      },
    },
  },
  {
    id: "8",
    createdAt: getRandomRecentDate(),
    interest: {
      email: "lucas.fournier@example.com",
      fullName: "Lucas Fournier",
      phone: "+33 7 56 78 90 12",
      message:
        "Je suis intéressé par la formation en DevOps. J'ai une expérience de 3 ans en développement backend. Est-ce que cette formation me permettra d'évoluer vers un poste de DevOps Engineer ?",
      formation: {
        name: "DevOps & Cloud Computing",
        description:
          "Maîtrisez les pratiques DevOps, l'automatisation, CI/CD, Docker, Kubernetes et les services cloud AWS, Azure et Google Cloud.",
        duration: 320,
        level: "Avancé",
        price: 3900,
        status: "pending",
      },
    },
  },
  {
    id: "9",
    createdAt: getRandomRecentDate(),
    interest: {
      email: "camille.dupont@example.com",
      fullName: "Camille Dupont",
      phone: "+33 6 12 34 56 78",
      message:
        "Bonjour, je suis graphiste et je souhaite me former à la 3D et à l'animation. Cette formation est-elle adaptée aux professionnels du design ?",
      formation: {
        name: "3D & Animation Numérique",
        description:
          "Apprenez à créer des modèles 3D, des animations et des effets visuels avec Blender, Maya et Cinema 4D.",
        duration: 380,
        level: "Intermédiaire",
        price: 3600,
        status: "accepted",
      },
    },
  },
  {
    id: "10",
    createdAt: getRandomRecentDate(),
    interest: {
      email: "mathieu.lambert@example.com",
      fullName: "Mathieu Lambert",
      phone: "+33 7 89 01 23 45",
      message:
        "Je suis intéressé par la formation en blockchain. J'ai des connaissances en programmation mais pas spécifiquement en blockchain. Est-ce un problème ?",
      formation: {
        name: "Blockchain & Développement Web3",
        description:
          "Découvrez les technologies blockchain, smart contracts, DApps et le développement d'applications décentralisées avec Ethereum et Solidity.",
        duration: 280,
        level: "Avancé",
        price: 3200,
        status: "pending",
      },
    },
  },
];
