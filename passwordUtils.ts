import * as bcrypt from 'bcrypt';

// Fonction pour hacher le mot de passe
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Définir le nombre de tours de salage
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// Exemple d'utilisation
async function testHashPassword() {
  const plainPassword = 'YahyaouiAdmin23';
  const hashedPassword = await hashPassword(plainPassword);
  console.log(hashedPassword); // Cela affichera le mot de passe haché
}

// Test de la fonction de hachage
testHashPassword();
