import type { Internship } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "COMPANY" | "ADMIN";
};

type AuthPayload = {
  user: AuthUser;
  token: string;
  refreshToken: string;
};

export type OfferApiModel = {
  id: string;
  title: string;
  description: string;
  salary?: string | number | null;
  location?: string | null;
  category?: string | null;
  languages?: string[];
  createdAt: string;
  applications?: Array<{ id: string; status: "PENDING" | "SHORTLISTED" | "ACCEPTED" | "REJECTED" }>;
  company?: {
    user?: {
      name?: string;
    };
  };
};

export type StudentProfile = {
  id: string;
  userId: string;
  bio?: string | null;
  skills: string[];
  profileStrength: number;
  user: { id: string; name: string; email: string };
};

export type CompanyProfile = {
  id: string;
  userId: string;
  description?: string | null;
  website?: string | null;
  user: { id: string; name: string; email: string };
};

export type StudentStats = {
  applications: number;
  shortlisted: number;
  pending: number;
  saved: number;
};

export type ApplicationModel = {
  id: string;
  status: "PENDING" | "SHORTLISTED" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  offer: OfferApiModel;
};

export type ApplicantModel = {
  id: string;
  status: "PENDING" | "SHORTLISTED" | "ACCEPTED" | "REJECTED";
  student: {
    id: string;
    user: { id: string; name: string; email: string };
  };
  offer: { id: string; title: string };
};

const TOKEN_KEY = "internbeacon_token";
const REFRESH_KEY = "internbeacon_refresh_token";
const USER_KEY = "internbeacon_user";

const isBrowser = () => typeof window !== "undefined";

const toError = async (response: Response) => {
  try {
    const payload = (await response.json()) as ApiResponse<unknown>;
    return payload.message || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
};

const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";

function sanitizeMessage(message?: string | null) {
  if (!message) return GENERIC_ERROR_MESSAGE;
  if (/request failed|network|fetch|unexpected token|syntaxerror/i.test(message)) {
    return "Could not reach the server. Please try again in a moment.";
  }
  return message;
}

function getToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function persistAuth(payload: AuthPayload) {
  if (!isBrowser()) return;
  localStorage.setItem(TOKEN_KEY, payload.token);
  localStorage.setItem(REFRESH_KEY, payload.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
}

export function clearAuth() {
  if (!isBrowser()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAuthToken() {
  return getToken();
}

export function getUserFriendlyError(
  err: unknown,
  fallback = GENERIC_ERROR_MESSAGE
) {
  if (err instanceof Error) {
    return sanitizeMessage(err.message);
  }
  return fallback;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new Error("Could not reach the server. Please try again in a moment.");
  }

  if (!response.ok) {
    throw new Error(sanitizeMessage(await toError(response)));
  }

  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.success) {
    throw new Error(sanitizeMessage(payload.message || "Request failed"));
  }

  return payload.data as T;
}

async function authRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  if (!token) {
    throw new Error("You are not logged in.");
  }

  return request<T>(path, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function loginUser(email: string, password: string) {
  return request<AuthPayload>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getAuthProfile() {
  return authRequest<AuthUser>("/auth/me");
}

export async function registerUser(params: {
  email: string;
  password: string;
  name: string;
  role: "STUDENT" | "COMPANY";
}) {
  return request<AuthPayload>("/auth/register", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function getOffers() {
  return request<OfferApiModel[]>("/offers");
}

export async function getOfferById(id: string) {
  return request<OfferApiModel>(`/offers/${id}`);
}

export async function getStudentProfile() {
  return authRequest<StudentProfile>("/students/profile");
}

export async function getStudentStats() {
  return authRequest<StudentStats>("/students/stats");
}

export async function getStudentApplications() {
  return authRequest<ApplicationModel[]>("/students/applications");
}

export async function getStudentRecommendations() {
  return authRequest<OfferApiModel[]>("/students/recommendations");
}

export async function getCompanyProfile() {
  return authRequest<CompanyProfile>("/companies/profile");
}

export async function getCompanyOffers() {
  return authRequest<OfferApiModel[]>("/companies/offers");
}

export async function getCompanyApplicants() {
  return authRequest<ApplicantModel[]>("/companies/applicants");
}

export async function updateApplicationStatus(id: string, status: "PENDING" | "SHORTLISTED" | "ACCEPTED" | "REJECTED") {
  return authRequest<{ id: string; status: string }>("/applications/status", {
    method: "PUT",
    body: JSON.stringify({ id, status }),
  });
}

export function roleHomePath(role?: AuthUser["role"]) {
  if (role === "COMPANY") return "/employer/dashboard";
  if (role === "ADMIN") return "/admin/dashboard";
  return "/dashboard";
}

export function mapOfferToInternship(offer: OfferApiModel): Internship {
  return {
    id: offer.id,
    title: offer.title,
    company: offer.company?.user?.name || "Confidential Company",
    location: offer.location || "Remote",
    description: offer.description,
    requirements: [],
    tags: offer.languages?.length ? offer.languages : [offer.category || "General"],
    postedAt: offer.createdAt,
    duration: "Flexible",
    stipend: offer.salary != null ? String(offer.salary) : "Not specified",
  };
}
