/**
 * Sample Contracts
 *
 * Contract file paths for testing the contract standardizer.
 * Each contract is stored in a separate file in the contracts/ folder.
 */

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface ContractFile {
  id: string;
  name: string;
  filename: string;
  path: string;
  description: string;
}

export const CONTRACT_FILES: ContractFile[] = [
  {
    id: "saas",
    name: "SaaS Agreement",
    filename: "saas.txt",
    path: path.join(__dirname, "contracts", "saas.txt"),
    description: "Well-structured SaaS agreement with all standard terms",
  },
  {
    id: "consulting",
    name: "Consulting Agreement",
    filename: "consulting.txt",
    path: path.join(__dirname, "contracts", "consulting.txt"),
    description: "Less formal consulting services agreement",
  },
  {
    id: "vendor",
    name: "Vendor MSA",
    filename: "vendor.txt",
    path: path.join(__dirname, "contracts", "vendor.txt"),
    description: "Complex vendor master services agreement",
  },
  {
    id: "email",
    name: "Email Proposal",
    filename: "email.txt",
    path: path.join(__dirname, "contracts", "email.txt"),
    description: "Minimal email proposal with sparse details",
  },
];
