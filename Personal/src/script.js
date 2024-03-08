"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = exports.redirectToAuthCodeFlow = void 0;
var clientId = "b4c01840ec424a1aa275703fc29b8fac"; // Replace with your client id
var params = new URLSearchParams(window.location.search);
var code = params.get("code");
if (!code) {
    redirectToAuthCodeFlow(clientId);
}
else {
    var accessToken = await getAccessToken(clientId, code);
    var profile = await fetchProfile(accessToken);
    populateUI(profile);
}
function redirectToAuthCodeFlow(clientId) {
    return __awaiter(this, void 0, void 0, function () {
        var verifier, challenge, params;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    verifier = generateCodeVerifier(128);
                    return [4 /*yield*/, generateCodeChallenge(verifier)];
                case 1:
                    challenge = _a.sent();
                    localStorage.setItem("verifier", verifier);
                    params = new URLSearchParams();
                    params.append("client_id", clientId);
                    params.append("response_type", "code");
                    params.append("redirect_uri", "https://ivoryle82.github.io/myspotify.html");
                    params.append("scope", "user-read-private user-read-email");
                    params.append("code_challenge_method", "S256");
                    params.append("code_challenge", challenge);
                    document.location = "https://accounts.spotify.com/authorize?".concat(params.toString());
                    return [2 /*return*/];
            }
        });
    });
}
exports.redirectToAuthCodeFlow = redirectToAuthCodeFlow;
function generateCodeVerifier(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
function generateCodeChallenge(codeVerifier) {
    return __awaiter(this, void 0, void 0, function () {
        var data, digest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = new TextEncoder().encode(codeVerifier);
                    return [4 /*yield*/, window.crypto.subtle.digest('SHA-256', data)];
                case 1:
                    digest = _a.sent();
                    return [2 /*return*/, btoa(String.fromCharCode.apply(null, __spreadArray([], new Uint8Array(digest), true)))
                            .replace(/\+/g, '-')
                            .replace(/\//g, '_')
                            .replace(/=+$/, '')];
            }
        });
    });
}
function getAccessToken(clientId, code) {
    return __awaiter(this, void 0, void 0, function () {
        var verifier, params, result, access_token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    verifier = localStorage.getItem("verifier");
                    params = new URLSearchParams();
                    params.append("client_id", clientId);
                    params.append("grant_type", "authorization_code");
                    params.append("code", code);
                    params.append("redirect_uri", "https://ivoryle82.github.io/myspotify.html");
                    params.append("code_verifier", verifier);
                    return [4 /*yield*/, fetch("https://accounts.spotify.com/api/token", {
                            method: "POST",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            body: params
                        })];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, result.json()];
                case 2:
                    access_token = (_a.sent()).access_token;
                    return [2 /*return*/, access_token];
            }
        });
    });
}
exports.getAccessToken = getAccessToken;
function fetchProfile(token) {
    return __awaiter(this, void 0, void 0, function () {
        var result, profile, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("https://api.spotify.com/v1/me", {
                            method: "GET",
                            headers: { Authorization: "Bearer ".concat(token) }
                        })];
                case 1:
                    result = _a.sent();
                    if (!result.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, result.json()];
                case 2:
                    profile = _a.sent();
                    console.log(profile); // Profile data logs to console
                    // Additional processing with profile data
                    return [2 /*return*/, profile];
                case 3: throw new Error("Failed to fetch profile: ".concat(result.status, " ").concat(result.statusText));
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("Error fetching profile:", error_1);
                    throw error_1; // Rethrow the error to handle it at the caller's level
                case 6: return [2 /*return*/];
            }
        });
    });
}
function populateUI(profile) {
    var _a, _b;
    document.getElementById("displayName").innerText = profile.display_name;
    if (profile.images[0]) {
        var profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar").appendChild(profileImage);
    }
    document.getElementById("id").innerText = profile.id;
    document.getElementById("email").innerText = profile.email;
    document.getElementById("uri").innerText = profile.uri;
    document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url").innerText = profile.href;
    document.getElementById("url").setAttribute("href", profile.href);
    document.getElementById("imgUrl").innerText = (_b = (_a = profile.images[0]) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : '(no profile image)';
}
