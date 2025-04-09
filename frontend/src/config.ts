export const config = {
    apiBaseUrl: process.env.NODE_ENV === 'production'
        ? 'https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net'
        : 'https://localhost:5000',
    recommendationsBaseUrl: process.env.NODE_ENV === 'production'
        ? 'https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net/recommendations'
        : 'https://localhost:5000/recommendations'
}; 