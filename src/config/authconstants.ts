export const clientConfig = [
	{
		clientId: process.env["CLIENT_ID"], //'moodle781uhui-client892kjjid-id832dhhw',
		clientSecret: process.env["CLIENT_SECRET"], //'your_client_secret',
		redirectUris: [
			"https://moodletest.qverselearning.org/admin/oauth2callback.php", // Example production redirect URI
		],
		scopes: ["openid", "profile", "email"],
	},
];
