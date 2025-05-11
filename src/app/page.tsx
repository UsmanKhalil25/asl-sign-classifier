import ASLClassifier from "@/app/components/asl-classifier";

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        ASL Sign Language Classifier
      </h1>
      <ASLClassifier />
    </div>
  );
}
