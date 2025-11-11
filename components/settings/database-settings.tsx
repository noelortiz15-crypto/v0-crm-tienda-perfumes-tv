"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Download, CheckCircle, XCircle, Copy, FileCode } from "lucide-react"
import {
  testMongoConnection,
  saveMongoConfig,
  getMongoConfig,
  exportSchemaToMongo,
  exportSupabaseSchema,
} from "@/app/actions/settings"
import { generateAllConnectionStrings } from "@/lib/db/connection-strings"

export function DatabaseSettings() {
  const [mongoConfig, setMongoConfig] = useState({
    uri: "",
    database: "",
    username: "",
    password: "",
  })
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [connectionStrings, setConnectionStrings] = useState<{ supabase: string; mongodb: string }>({
    supabase: "",
    mongodb: "",
  })

  useEffect(() => {
    loadMongoConfig()
    loadConnectionStrings()
  }, [])

  const loadMongoConfig = async () => {
    const config = await getMongoConfig()
    if (config) {
      setMongoConfig(config)
    }
  }

  const loadConnectionStrings = async () => {
    const strings = await generateAllConnectionStrings()
    setConnectionStrings(strings)
  }

  const handleTestConnection = async () => {
    setConnectionStatus("testing")
    setStatusMessage("Testing connection...")

    try {
      const result = await testMongoConnection(mongoConfig)
      if (result.success) {
        setConnectionStatus("success")
        setStatusMessage("Connection successful!")
      } else {
        setConnectionStatus("error")
        setStatusMessage(result.error || "Connection failed")
      }
    } catch (error) {
      setConnectionStatus("error")
      setStatusMessage("Failed to test connection")
    }
  }

  const handleSaveConfig = async () => {
    setIsSaving(true)
    try {
      await saveMongoConfig(mongoConfig)
      setStatusMessage("Configuration saved successfully!")
      loadConnectionStrings()
      setTimeout(() => setStatusMessage(""), 3000)
    } catch (error) {
      setStatusMessage("Failed to save configuration")
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportSchema = async () => {
    setIsExporting(true)
    try {
      const result = await exportSchemaToMongo()

      const blob = new Blob([result.schema], { type: "application/javascript" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "mongodb-schema.js"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setStatusMessage("MongoDB schema exported successfully!")
      setTimeout(() => setStatusMessage(""), 3000)
    } catch (error) {
      setStatusMessage("Failed to export schema")
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportSupabaseSchema = async () => {
    setIsExporting(true)
    try {
      const result = await exportSupabaseSchema()

      const blob = new Blob([result.schema], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "supabase-schema.sql"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setStatusMessage("Supabase schema exported successfully!")
      setTimeout(() => setStatusMessage(""), 3000)
    } catch (error) {
      setStatusMessage("Failed to export schema")
    } finally {
      setIsExporting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setStatusMessage("Connection string copied to clipboard!")
    setTimeout(() => setStatusMessage(""), 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="w-5 h-5" />
            Connection Strings
          </CardTitle>
          <CardDescription>Database connection strings for external access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Supabase Connection String</Label>
            <div className="flex gap-2">
              <Input value={connectionStrings.supabase} readOnly className="font-mono text-xs bg-slate-50" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(connectionStrings.supabase)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500">PostgreSQL connection string for direct database access</p>
          </div>

          <div className="space-y-2">
            <Label>MongoDB Connection String</Label>
            <div className="flex gap-2">
              <Input value={connectionStrings.mongodb} readOnly className="font-mono text-xs bg-slate-50" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(connectionStrings.mongodb)}
                disabled={!connectionStrings.mongodb}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              {connectionStrings.mongodb
                ? "MongoDB connection string from configuration"
                : "Configure MongoDB below to generate connection string"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Configuration
          </CardTitle>
          <CardDescription>Configure your database connections and export schema structures</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="supabase" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="supabase">Supabase (Current)</TabsTrigger>
              <TabsTrigger value="mongodb">MongoDB</TabsTrigger>
            </TabsList>

            <TabsContent value="supabase" className="space-y-4 mt-4">
              <Alert>
                <AlertDescription>
                  Your application is currently using Supabase (PostgreSQL) as the database. The connection is
                  configured through environment variables.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label>Current Database</Label>
                  <p className="text-sm text-slate-600 mt-1">PostgreSQL via Supabase</p>
                </div>

                <div>
                  <Label>Tables</Label>
                  <div className="text-sm text-slate-600 mt-1 space-y-1">
                    <p>• profiles</p>
                    <p>• suppliers</p>
                    <p>• products</p>
                    <p>• customers</p>
                    <p>• employees</p>
                    <p>• sales</p>
                    <p>• sales_items</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleExportSupabaseSchema}
                    disabled={isExporting}
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isExporting ? "Exporting..." : "Export SQL Schema (.sql)"}
                  </Button>

                  <Button onClick={handleExportSchema} disabled={isExporting} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    {isExporting ? "Exporting..." : "Export Schema to MongoDB Format"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mongodb" className="space-y-4 mt-4">
              <Alert>
                <AlertDescription>
                  Configure MongoDB connection to migrate your data from Supabase. After exporting the schema, you can
                  import it into your MongoDB instance.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mongo-uri">Connection URI</Label>
                  <Input
                    id="mongo-uri"
                    type="text"
                    placeholder="mongodb://localhost:27017 or mongodb+srv://..."
                    value={mongoConfig.uri}
                    onChange={(e) => setMongoConfig({ ...mongoConfig, uri: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">
                    Local: mongodb://localhost:27017 | Atlas: mongodb+srv://cluster.mongodb.net
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mongo-database">Database Name</Label>
                  <Input
                    id="mongo-database"
                    type="text"
                    placeholder="perfume_crm"
                    value={mongoConfig.database}
                    onChange={(e) => setMongoConfig({ ...mongoConfig, database: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mongo-username">Username (Optional)</Label>
                    <Input
                      id="mongo-username"
                      type="text"
                      placeholder="admin"
                      value={mongoConfig.username}
                      onChange={(e) => setMongoConfig({ ...mongoConfig, username: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mongo-password">Password (Optional)</Label>
                    <Input
                      id="mongo-password"
                      type="password"
                      placeholder="••••••••"
                      value={mongoConfig.password}
                      onChange={(e) => setMongoConfig({ ...mongoConfig, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleTestConnection}
                    disabled={!mongoConfig.uri || connectionStatus === "testing"}
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    {connectionStatus === "testing" && "Testing..."}
                    {connectionStatus === "idle" && "Test Connection"}
                    {connectionStatus === "success" && (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Connected
                      </>
                    )}
                    {connectionStatus === "error" && (
                      <>
                        <XCircle className="w-4 h-4 mr-2 text-red-600" />
                        Failed
                      </>
                    )}
                  </Button>

                  <Button onClick={handleSaveConfig} disabled={!mongoConfig.uri || isSaving} className="flex-1">
                    {isSaving ? "Saving..." : "Save Configuration"}
                  </Button>
                </div>

                {statusMessage && (
                  <Alert>
                    <AlertDescription>{statusMessage}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Migration Instructions</CardTitle>
          <CardDescription>How to migrate from Supabase to MongoDB</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
            <li>Export the Supabase SQL schema using the button above</li>
            <li>Export the MongoDB schema using the button above</li>
            <li>Install MongoDB locally or use MongoDB Atlas</li>
            <li>Run the exported MongoDB schema script in MongoDB shell or Compass</li>
            <li>Export your data from Supabase (use pg_dump or Supabase dashboard)</li>
            <li>Import the data into MongoDB using mongoimport or custom scripts</li>
            <li>Configure the MongoDB connection in this settings page</li>
            <li>Test the connection to ensure everything works</li>
            <li>Use the connection strings above in your external applications</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
