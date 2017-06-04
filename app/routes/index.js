import LoginController from "../controllers/loginController";

export default function initRoutes(app) {
	app.post("/auth/mail/send", LoginController.sendOTP);
	app.post("/auth/mail/verify", LoginController.verifyOTP);
}
