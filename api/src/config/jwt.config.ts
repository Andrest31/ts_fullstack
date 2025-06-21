/* eslint-disable prettier/prettier */
export const jwtConfig = {
  secret: 'your-strong-secret-key', // На продакшене через process.env
  salt: 'unique-pepper-value', // Дополнительная соль
  expiresIn: '1h'
};