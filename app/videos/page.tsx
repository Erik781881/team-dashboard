import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabaseAdmin } from "@/lib/supabase";

export default async function VideosPage() {
  const { data: videos } = await supabaseAdmin.from("videos").select("*").order("title");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Training Videos</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {videos?.map((video) => (
          <Card key={video.id}>
            <CardHeader>
              <CardTitle>{video.title}</CardTitle>
              <CardDescription>{video.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video overflow-hidden rounded-md">
                <iframe
                  src={video.youtube_url}
                  title={video.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
