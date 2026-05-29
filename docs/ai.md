# AI

AI features are implemented through provider abstractions so development, staging,
and production can use different backends safely.

## Planned Capabilities

- Room layout suggestions
- Auto-furnish suggestions
- Color palette generation
- Blueprint analysis foundation
- Interior design assistant chat

## Safety Rules

- Do not hardcode provider secrets.
- Clearly label local development providers.
- Log request metadata without storing sensitive prompt data unless explicitly required.
- Validate inputs before provider calls.
