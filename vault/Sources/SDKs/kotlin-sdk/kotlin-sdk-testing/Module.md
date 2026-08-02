---
id: "modelcontextprotocol-kotlin-sdk-kotlin-sdk-testing-module-md-24504ed9cc"
title: "Module kotlin-sdk-testing"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/kotlin-sdk"
source_path: "kotlin-sdk-testing/Module.md"
source_url: "https://github.com/modelcontextprotocol/kotlin-sdk/blob/b133d7ecdd42a498d09dc3e60094fae94e1e899c/kotlin-sdk-testing/Module.md"
commit: "b133d7ecdd42a498d09dc3e60094fae94e1e899c"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/kotlin"
concepts:
  - "[[Architecture]]"
  - "[[Transports]]"
  - "[[Testing]]"
  - "[[SDKs]]"
---

# Module kotlin-sdk-testing

`kotlin-sdk-testing` provides testing utilities for MCP client-server interactions. It eliminates the need for external
processes or network connections by offering coroutine-safe in-memory transport implementations that connect clients and servers directly.

## Typical usage

1. Create linked transport pair with `ChannelTransport.createLinkedPair()`.
2. Connect client and server concurrently using the paired transports.
3. Configure server request handlers.
4. Execute client operations and verify results.

### Complete test example

```kotlin
@OptIn(ExperimentalMcpApi::class)
@Test
fun testClientServerCommunication(): Unit = runBlocking {
    val server = Server(
        Implementation(name = "test server", version = "1.0"),
        ServerOptions(capabilities = ServerCapabilities(resources = ServerCapabilities.Resources())),
    )

    val (clientTransport, serverTransport) = ChannelTransport.createLinkedPair()

    val client = Client(clientInfo = Implementation(name = "test client", version = "1.0"))

    val serverSessionResult = CompletableDeferred<ServerSession>()
    listOf(
        launch { client.connect(clientTransport) },
        launch { serverSessionResult.complete(server.createSession(serverTransport)) },
    ).joinAll()

    val serverSession = serverSessionResult.await()
    serverSession.setRequestHandler<InitializeRequest>(Method.Defined.Initialize) { _, _ ->
        InitializeResult(
            protocolVersion = LATEST_PROTOCOL_VERSION,
            capabilities = ServerCapabilities(
                resources = ServerCapabilities.Resources(null, null),
                tools = ServerCapabilities.Tools(null),
            ),
            serverInfo = Implementation(name = "test", version = "1.0"),
        )
    }

    serverSession.setRequestHandler<ListResourcesRequest>(Method.Defined.ResourcesList) { _, _ ->
        ListResourcesResult(
            resources = listOf(Resource(uri = "/foo/bar", name = "foo-bar-resource")),
        )
    }

    // Test client operations
    client.listResources() shouldNotBeNull {
        this.resources shouldHaveSize 1
    }

    // Clean up resources
    client.close()
    server.close()
}
```

**Note**: In production tests, wrap client/server operations in try-finally blocks to ensure proper resource cleanup even if assertions fail.

Use this module for unit and integration testing of MCP implementations without managing external server processes,
network ports, or I/O streams. The channel-based transport ensures tests run instantly with full isolation between test
cases.

## Related concepts

- [[Architecture]]
- [[Transports]]
- [[Testing]]
- [[SDKs]]
