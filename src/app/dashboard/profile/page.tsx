export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text p-10">
      <h1 className="mb-6 text-center text-4xl font-extrabold text-light-primary dark:text-dark-highlight">
        Profile
      </h1>
      <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3">
        {/* Section Profil */}
        <div className="col-span-1 rounded-lg bg-light-card p-6 shadow-lg dark:bg-dark-card">
          <div className="flex flex-col items-center">
            <img
              src="https://i.pravatar.cc/150?img=7"
              alt="Profile"
              className="h-24 w-24 rounded-full mb-4 border-4 border-light-border dark:border-dark-border"
            />
            <h2 className="text-xl font-bold text-light-primary dark:text-dark-primary">
              Adela Parkson
            </h2>
            <p className="text-sm text-light-secondary dark:text-dark-secondary mb-6">
              Product Designer
            </p>
            <div className="flex justify-around w-full">
              <div className="text-center">
                <p className="text-lg font-semibold text-light-primary dark:text-dark-highlight">
                  5
                </p>
                <p className="text-sm text-light-secondary dark:text-dark-secondary">
                  Projects
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Stockage */}
        <div className="col-span-1 rounded-lg bg-light-card p-6 shadow-lg dark:bg-dark-card">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 flex items-center justify-center bg-light-background rounded-full dark:bg-dark-secondary mb-4">
              <span className="text-2xl text-light-primary dark:text-dark-highlight">
                ☁️
              </span>
            </div>
            <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary mb-2">
              Your storage
            </h3>
            <p className="text-sm text-light-secondary dark:text-dark-secondary mb-4">
              Supervise your drive space in the easiest way
            </p>
            <div className="w-full bg-light-border h-2 rounded-full dark:bg-dark-border">
              <div className="bg-light-primary h-2 rounded-full w-[50%] dark:bg-dark-highlight"></div>
            </div>
            <p className="mt-2 text-sm text-light-secondary dark:text-dark-secondary">
              25.6 GB / 50 GB
            </p>
          </div>
        </div>

        {/* Upload Files */}
        <div className="col-span-1 rounded-lg bg-light-card p-6 shadow-lg dark:bg-dark-card">
          <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary mb-2">
            Upload Files
          </h3>
          <p className="text-sm text-light-secondary dark:text-dark-secondary mb-4">
            PNG, JPG and GIF files are allowed
          </p>
          <button className="w-full bg-light-primary text-white py-2 rounded-lg shadow-md hover:bg-light-highlight dark:bg-dark-highlight dark:text-dark-text dark:hover:bg-dark-border">
            Publish now
          </button>
        </div>

        {/* Section Projets */}
        <div className="col-span-2 rounded-lg bg-light-card p-6 shadow-lg dark:bg-dark-card">
          <h3 className="text-lg font-bold text-light-primary dark:text-dark-primary mb-4">
            All Projects
          </h3>
          <p className="text-sm text-light-secondary dark:text-dark-secondary mb-4">
            Here you can find more details about your projects.
          </p>
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 bg-light-background rounded-lg dark:bg-dark-background">
              <div>
                <h4 className="font-bold text-light-primary dark:text-dark-highlight">
                  Technology behind the Blockchain
                </h4>
                <p className="text-sm text-light-secondary dark:text-dark-secondary">
                  Project #1 • See project details
                </p>
              </div>
              <span className="text-light-secondary dark:text-dark-border">
                ✏️
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-light-background rounded-lg dark:bg-dark-background">
              <div>
                <h4 className="font-bold text-light-primary dark:text-dark-highlight">
                  Greatest way to a good Economy
                </h4>
                <p className="text-sm text-light-secondary dark:text-dark-secondary">
                  Project #2 • See project details
                </p>
              </div>
              <span className="text-light-secondary dark:text-dark-border">
                ✏️
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-lg bg-light-card p-6 shadow-lg dark:bg-dark-card">
          <h3 className="text-lg font-bold text-light-primary dark:text-dark-primary mb-4">
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm">Item update notifications</p>
              <input
                type="checkbox"
                className="form-checkbox text-light-primary dark:text-dark-highlight"
                defaultChecked
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm">Buyer review notifications</p>
              <input
                type="checkbox"
                className="form-checkbox text-light-primary dark:text-dark-highlight"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
