export default function Contact() {
    return (
        <section id="contact" className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900/50">
            <div className="container-custom">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Get In Touch</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Open to speaking engagements, advisory roles, and strategic partnerships.
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-xl sm:mt-20">
                    <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-2 mb-12">
                        <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                            <h3 className="text-lg font-bold text-brand-blue mb-2">Office</h3>
                            <p className="text-gray-600 dark:text-gray-300">02 192 5271-2</p>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                            <h3 className="text-lg font-bold text-brand-blue mb-2">Mobile</h3>
                            <p className="text-gray-600 dark:text-gray-300">093 789 3259</p>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                            <h3 className="text-lg font-bold text-brand-blue mb-2">Email</h3>
                            <p className="text-gray-600 dark:text-gray-300">samartch@manserv.co.th</p>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                            <h3 className="text-lg font-bold text-brand-blue mb-2">Website</h3>
                            <p className="text-gray-600 dark:text-gray-300">www.manserv.co.th</p>
                        </div>
                    </div>

                    <form action="#" method="POST" className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                        <div className="sm:col-span-2">
                            <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">Name</label>
                            <div className="mt-2.5">
                                <input type="text" name="name" id="name" autoComplete="name" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:ring-gray-700 dark:text-white dark:focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">Email</label>
                            <div className="mt-2.5">
                                <input type="email" name="email" id="email" autoComplete="email" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:ring-gray-700 dark:text-white dark:focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">Message</label>
                            <div className="mt-2.5">
                                <textarea name="message" id="message" rows={4} className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:ring-gray-700 dark:text-white dark:focus:ring-blue-500"></textarea>
                            </div>
                        </div>

                        <div className="sm:col-span-2 mt-4">
                            <button
                                type="button"
                                className="block w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
                        Prefer email? <a href="mailto:hello@example.com" className="font-semibold text-blue-600 hover:text-blue-500">hello@example.com</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
