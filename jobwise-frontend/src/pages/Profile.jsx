import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { DEFAULT_AVATAR } from "@/constants"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"

export default function Profile() {
  const { user, updateProfile, refreshUser } = useAuth()

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [password, setPassword] = useState("")
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar
      ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
      : DEFAULT_AVATAR
  )

  const [skills, setSkills] = useState(user?.skills || [])
  const [newSkill, setNewSkill] = useState("")

  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")

  // ✅ Handle avatar file select
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  // ✅ Add skill
  const handleAddSkill = () => {
    const skill = newSkill.trim()
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill])
      setNewSkill("")
    }
  }

  // ✅ Remove skill
  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  // ✅ Save profile changes
  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg("")

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("email", email)
      if (password) formData.append("password", password)
      if (avatarFile) formData.append("avatar", avatarFile)
      formData.append("skills", JSON.stringify(skills))

      const result = await updateProfile(formData)

      if (result.success) {
        setPassword("") // clear password input
        setMsg("✅ Profile updated successfully!")
        await refreshUser() // refresh dashboard data asap
      } else {
        setMsg(`❌ ${result.message}`)
      }
    } catch (_err) {
      // underscore avoids the unused-var lint error
      setMsg("❌ Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {/* ✅ Success / Error message */}
          {msg && (
            <p
              className={`mb-4 ${
                msg.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {msg}
            </p>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <img
                src={avatarPreview}
                alt="avatar"
                className="w-20 h-20 rounded-full border object-cover"
              />
              <label className="cursor-pointer text-blue-600 hover:underline">
                Change Avatar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>

            {/* Name */}
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                className="w-full border rounded p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                className="w-full border rounded p-2"
                placeholder="Leave blank to keep current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block mb-1 font-medium">Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 border rounded p-2"
                  placeholder="e.g. JavaScript"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddSkill())
                  }
                />
                <Button type="button" onClick={handleAddSkill}>
                  Add
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <X
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => handleRemoveSkill(skill)}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Save Button */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
