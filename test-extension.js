#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Wispr Voice to Text Extension');
console.log('=====================================');

// Check if compiled files exist
const outDir = path.join(__dirname, 'out');
const extensionJs = path.join(outDir, 'extension.js');
const testDir = path.join(outDir, 'test');

console.log('\n📁 Checking compiled files...');

if (fs.existsSync(extensionJs)) {
    console.log('✅ Extension compiled successfully');
} else {
    console.log('❌ Extension not compiled - run npm run compile');
    process.exit(1);
}

if (fs.existsSync(testDir)) {
    console.log('✅ Tests compiled successfully');
} else {
    console.log('❌ Tests not compiled');
}

// Check package.json configuration
console.log('\n📋 Checking package.json configuration...');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Verify essential fields
const requiredFields = ['name', 'publisher', 'main', 'engines'];
const missingFields = requiredFields.filter(field => !packageJson[field]);

if (missingFields.length === 0) {
    console.log('✅ Package.json has all required fields');
} else {
    console.log(`❌ Missing required fields: ${missingFields.join(', ')}`);
}

// Check commands
if (packageJson.contributes && packageJson.contributes.commands) {
    const commands = packageJson.contributes.commands;
    console.log(`✅ ${commands.length} commands registered`);
    commands.forEach(cmd => {
        console.log(`   - ${cmd.command}: ${cmd.title}`);
    });
} else {
    console.log('❌ No commands found in package.json');
}

// Check activation events
if (packageJson.activationEvents && packageJson.activationEvents.length > 0) {
    console.log(`✅ Activation events: ${packageJson.activationEvents.join(', ')}`);
} else {
    console.log('⚠️  No activation events specified');
}

console.log('\n🎯 Extension ID:', `${packageJson.publisher}.${packageJson.name}`);

console.log('\n🚀 To test the extension:');
console.log('1. Open VS Code');
console.log('2. Press F5 to run the extension');
console.log('3. Look for the 🎤 Wispr icon in the status bar');
console.log('4. Check the Developer Console for debug messages');

console.log('\n🧪 To run tests:');
console.log('1. npm test (command line)');
console.log('2. F5 > Extension Tests (VS Code)');

console.log('\n✨ Extension test completed!'); 