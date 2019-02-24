export interface IServerConfig {
  serverPassword: string;
  port: number;
  clientLoggingEnabled: boolean;
  clientLoggingMaxRecords: number;
  clientLoggingMessageWireTap: string[];
}
