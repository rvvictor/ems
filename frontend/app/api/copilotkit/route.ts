import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";

const serviceAdapter = new GoogleGenerativeAIAdapter({
  apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY,
  model: "gemini-2.5-flash",
  apiVersion: "v1",
});
const runtime = new CopilotRuntime();

const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
  runtime,
  serviceAdapter,
  endpoint: "/api/copilotkit",
});

export const POST = handleRequest;
export const GET = handleRequest;