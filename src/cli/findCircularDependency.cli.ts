#!/usr/bin/env node
import { findCircularDependency } from "../dependencies/findCircularDependency.js";

findCircularDependency(process.argv[2], {});
